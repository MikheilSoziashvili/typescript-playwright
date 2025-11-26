import { logger } from "@logger/logger";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { waitUntil } from "@core/utils/utils";
import {
	DogeTestnetConfigError,
	DogeTestnetConnectionError,
	DogeTestnetFundingError,
	DogeTestnetTransactionError,
} from "@core/errors/doge-testnet-errors";
import { HttpMethod } from "@enums/api/http-methods";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";
import {
	AddressBalanceResponse,
	ElectrsUtxo,
	TransactionResult,
	ElectrsTxResponse,
} from "@core/interfaces";
import {
	DOGECOIN_TESTNET,
	DOGE_MIN_BALANCE,
	DOGE_FEE_SATOSHIS,
} from "@constants/doge-client-constants";

const ECPair = ECPairFactory(ecc);

/**
 * Dogecoin Testnet Client
 * - Uses testnet-wallet.doge.toys for wallet generation
 * - Uses faucet.doge.toys for funding
 * - Uses Electrs API for balance/transactions
 * - Client-side signing
 */
export class DogeTestnetClient {
	private static readonly SATOSHIS_PER_DOGE = 100000000;
	private readonly electrsApi: string;
	private readonly address: string;
	private readonly keyPair: ReturnType<typeof ECPair.fromWIF>;

	constructor(privateKeyWIF: string, address: string) {
		this.electrsApi = "https://doge-electrs-testnet-demo.qed.me";

		// Initialize Bitcoin library with secp256k1
		bitcoin.initEccLib(ecc);

		// Create key pair from WIF
		this.keyPair = ECPair.fromWIF(privateKeyWIF, DOGECOIN_TESTNET);

		// Derive address from private key to verify it matches
		const { address: derivedAddress } = bitcoin.payments.p2pkh({
			pubkey: this.keyPair.publicKey,
			network: DOGECOIN_TESTNET,
		});

		// Verify address matches
		if (derivedAddress !== address) {
			throw new DogeTestnetConfigError(
				`Address mismatch! Private key generates address ${derivedAddress} but you provided ${address}. ` +
					`Please regenerate your wallet or fix the address in your .env file.`,
			);
		}

		this.address = address;
	}

	/**
	 * Extracts error message from unknown error type
	 */
	private getErrorMessage(error: unknown): string {
		return error instanceof Error ? error.message : "Unknown error";
	}

	/**
	 * Gets the current balance using Electrs API
	 */
	private async getCurrentBalance(): Promise<number> {
		try {
			const response = await fetch(
				`${this.electrsApi}/address/${this.address}`,
			);

			if (!response.ok) {
				throw new Error(`Balance check failed: ${response.statusText}`);
			}

			const data = (await response.json()) as AddressBalanceResponse;

			const chainBalance =
				data.chain_stats.funded_txo_sum -
				data.chain_stats.spent_txo_sum;
			const mempoolBalance =
				data.mempool_stats.funded_txo_sum -
				data.mempool_stats.spent_txo_sum;
			const totalSatoshis = chainBalance + mempoolBalance;

			return totalSatoshis / DogeTestnetClient.SATOSHIS_PER_DOGE;
		} catch (error) {
			throw new DogeTestnetConnectionError(
				`Failed to get balance: ${this.getErrorMessage(error)}`,
			);
		}
	}

	/**
	 * Ensures the wallet has sufficient balance
	 * NOTE: Auto-funding is unavailable - fund manually at https://faucet.doge.toys/
	 */
	private async ensureFunded(minBalance = DOGE_MIN_BALANCE): Promise<void> {
		const currentBalance = await this.getCurrentBalance();
		logger.info(`[DOGE Testnet] Current balance: ${currentBalance} DOGE`);

		if (currentBalance < minBalance) {
			throw new DogeTestnetFundingError(
				`Insufficient balance! Need ${minBalance} DOGE, have ${currentBalance} DOGE. ` +
					`Please fund your wallet manually at: https://faucet.doge.toys/ ` +
					`Address: ${this.address}`,
				this.address,
			);
		}
	}

	/**
	 * Gets UTXOs for the address
	 */
	private async getUtxos(): Promise<ElectrsUtxo[]> {
		try {
			const response = await fetch(
				`${this.electrsApi}/address/${this.address}/utxo`,
			);

			if (!response.ok) {
				throw new Error(`UTXO fetch failed: ${response.statusText}`);
			}

			return (await response.json()) as ElectrsUtxo[];
		} catch (error) {
			throw new DogeTestnetConnectionError(
				`Failed to get UTXOs: ${this.getErrorMessage(error)}`,
			);
		}
	}

	/**
	 * Selects UTXOs to cover the required amount plus fees
	 */
	private selectUtxos(
		confirmedUtxos: ElectrsUtxo[],
		amountSatoshis: number,
		feeSatoshis: number,
	): { utxos: ElectrsUtxo[]; total: number } {
		let inputTotal = 0;
		const inputsToUse: ElectrsUtxo[] = [];

		for (const utxo of confirmedUtxos) {
			if (inputTotal >= amountSatoshis + feeSatoshis) {
				break;
			}

			inputsToUse.push(utxo);
			inputTotal += utxo.value;
		}

		if (inputTotal < amountSatoshis + feeSatoshis) {
			throw new Error(
				`Insufficient funds. Need ${
					(amountSatoshis + feeSatoshis) /
					DogeTestnetClient.SATOSHIS_PER_DOGE
				} DOGE, have ${
					inputTotal / DogeTestnetClient.SATOSHIS_PER_DOGE
				} DOGE`,
			);
		}

		return { utxos: inputsToUse, total: inputTotal };
	}

	/**
	 * Adds inputs to PSBT by fetching raw transaction data
	 */
	private async addInputsToPsbt(
		psbt: bitcoin.Psbt,
		utxos: ElectrsUtxo[],
	): Promise<void> {
		for (const utxo of utxos) {
			const txResponse = await fetch(
				`${this.electrsApi}/tx/${utxo.txid}/hex`,
			);

			if (!txResponse.ok) {
				throw new Error(
					`Failed to fetch transaction ${utxo.txid}: ${txResponse.statusText}`,
				);
			}

			const txHex = await txResponse.text();

			psbt.addInput({
				hash: utxo.txid,
				index: utxo.vout,
				nonWitnessUtxo: Buffer.from(txHex, "hex"),
			});
		}
	}

	/**
	 * Builds and signs a Dogecoin transaction
	 */
	private async buildAndSignTransaction(
		destinationAddress: string,
		amountSatoshis: number,
		feeSatoshis: number,
	): Promise<string> {
		const utxos = await this.getUtxos();

		if (utxos.length === 0) {
			throw new Error("No UTXOs available");
		}

		const confirmedUtxos = utxos.filter((u) => u.status.confirmed);

		if (confirmedUtxos.length === 0) {
			throw new Error("No confirmed UTXOs available");
		}

		// Select UTXOs
		const { utxos: inputsToUse, total: inputTotal } = this.selectUtxos(
			confirmedUtxos,
			amountSatoshis,
			feeSatoshis,
		);

		// Create transaction
		const psbt = new bitcoin.Psbt({ network: DOGECOIN_TESTNET });

		// Add inputs
		await this.addInputsToPsbt(psbt, inputsToUse);

		// Add output to recipient
		psbt.addOutput({
			address: destinationAddress,
			value: BigInt(amountSatoshis),
		});

		// Add change output if needed
		const changeSatoshis = inputTotal - amountSatoshis - feeSatoshis;
		if (changeSatoshis > 0) {
			psbt.addOutput({
				address: this.address,
				value: BigInt(changeSatoshis),
			});
		}

		// Sign all inputs
		for (let i = 0; i < inputsToUse.length; i++) {
			psbt.signInput(i, this.keyPair);
		}

		// Validate signatures
		if (
			!psbt.validateSignaturesOfAllInputs((pubkey, msghash, signature) =>
				ECPair.fromPublicKey(pubkey, {
					network: DOGECOIN_TESTNET,
				}).verify(msghash, signature),
			)
		) {
			throw new Error("Signature validation failed");
		}

		// Finalize and extract
		psbt.finalizeAllInputs();
		const tx = psbt.extractTransaction();
		const txHex = tx.toHex();

		logger.info(`[DOGE Testnet] Transaction built`, {
			inputs: inputsToUse.length,
			outputs: psbt.data.outputs.length,
			size: txHex.length / 2,
		});

		return txHex;
	}

	/**
	 * Broadcasts a signed transaction to the network
	 */
	private async broadcastTransaction(txHex: string): Promise<string> {
		const response = await fetch(`${this.electrsApi}/tx`, {
			method: HttpMethod.POST,
			body: txHex,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Transaction broadcast failed: ${errorText}`);
		}

		return response.text();
	}

	/**
	 * Sends DOGE from the test wallet to a destination address.
	 * Automatically ensures wallet is funded before sending.
	 *
	 * @param destinationAddress - The DOGE address to send to
	 * @param amount - Amount of DOGE to send (as string, e.g., "10.0")
	 * @returns Transaction hash and ID
	 */
	public async sendToAddress(
		destinationAddress: string,
		amount: string,
	): Promise<{ id: string; txHash: string }> {
		const FEE_BUFFER = 10;
		const requiredBalance = Number(amount) + FEE_BUFFER;
		await this.ensureFunded(requiredBalance);

		logger.info(`[DOGE Testnet] Send transaction initiated`, {
			from: this.address,
			to: destinationAddress,
			amount: amount,
		});

		try {
			const amountSatoshis = Math.floor(
				Number(amount) * DogeTestnetClient.SATOSHIS_PER_DOGE,
			);
			const feeSatoshis = DOGE_FEE_SATOSHIS;

			const txHex = await this.buildAndSignTransaction(
				destinationAddress,
				amountSatoshis,
				feeSatoshis,
			);

			const txHash = await this.broadcastTransaction(txHex);

			logger.info(`[DOGE Testnet] Transaction submitted`, {
				hash: txHash,
			});

			return {
				id: txHash,
				txHash: txHash,
			};
		} catch (error) {
			throw new DogeTestnetTransactionError(
				`Failed to send DOGE transaction: ${this.getErrorMessage(
					error,
				)}`,
			);
		}
	}

	/**
	 * Gets transaction details by hash
	 */
	public async getTransaction(txHash: string): Promise<TransactionResult> {
		try {
			const response = await fetch(`${this.electrsApi}/tx/${txHash}`);

			if (!response.ok) {
				throw new Error(
					`Transaction fetch failed: ${response.statusText}`,
				);
			}

			const tx = (await response.json()) as ElectrsTxResponse;

			return {
				txHash: tx.txid,
				validated: tx.status.confirmed,
			};
		} catch (error) {
			throw new DogeTestnetTransactionError(
				`Failed to get transaction ${txHash}: ${this.getErrorMessage(
					error,
				)}`,
				txHash,
			);
		}
	}

	/**
	 * Waits for transaction to be confirmed on the blockchain
	 */
	public async waitForCompletion(txHash: string): Promise<void> {
		logger.info(`[DOGE Testnet] Waiting for tx confirmation`, { txHash });

		try {
			await waitUntil(
				async () => {
					const tx = await this.getTransaction(txHash);
					return tx.validated;
				},
				{
					errorMessage: `DOGE testnet tx ${txHash} not confirmed`,
					intervalSeconds: TimeoutSeconds.TWO,
					timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
				},
			);

			logger.info(`[DOGE Testnet] Transaction confirmed`, { txHash });
		} catch (error) {
			if (
				error instanceof DogeTestnetConnectionError ||
				error instanceof DogeTestnetTransactionError
			) {
				throw error;
			}
			throw new DogeTestnetTransactionError(
				`Timeout waiting for transaction ${txHash} to confirm`,
				txHash,
			);
		}
	}

	/**
	 * Gets the wallet address (for reference)
	 */
	public getWalletAddress(): string {
		return this.address;
	}

	/**
	 * Gets the current DOGE balance of the test wallet
	 */
	public async getBalance(): Promise<number> {
		return this.getCurrentBalance();
	}
}
