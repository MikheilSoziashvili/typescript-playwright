import { Client, Wallet, xrpToDrops, Payment } from "xrpl";
import { logger } from "@logger/logger";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { waitUntil } from "@core/utils/utils";
import { FaucetResponse, TransactionResult } from "@core/interfaces";
import {
	XrpTestnetConnectionError,
	XrpTestnetFundingError,
	XrpTestnetTransactionError,
} from "@core/errors/xrp-testnet-errors";
import { HttpMethod } from "@enums/api/http-methods";
import { ContentType } from "@enums/api/content-types";

export class XrpTestnetClient {
	private readonly client: Client;
	private readonly wallet: Wallet;
	private readonly faucetUrl: string;

	constructor(walletSeed: string, testnetUrl: string, faucetUrl: string) {
		this.client = new Client(testnetUrl);
		this.wallet = Wallet.fromSeed(walletSeed);
		this.faucetUrl = faucetUrl;
	}

	/**
	 * Extracts error message from unknown error type
	 */
	private getErrorMessage(error: unknown): string {
		return error instanceof Error ? error.message : "Unknown error";
	}

	/**
	 * Connects to XRP testnet
	 */
	private async connect(): Promise<void> {
		try {
			await this.client.connect();
		} catch (error) {
			throw new XrpTestnetConnectionError(
				`Failed to connect to XRP testnet: ${this.getErrorMessage(
					error,
				)}`,
			);
		}
	}

	/**
	 * Gets the current balance as a number
	 */
	private async getCurrentBalance(): Promise<number> {
		const balance = await this.client.getXrpBalance(this.wallet.address);
		return Number(balance);
	}

	/**
	 * Ensures the wallet has sufficient balance, auto-funding from faucet if needed
	 */
	private async ensureFunded(minBalance = 50): Promise<void> {
		await this.connect();

		try {
			const currentBalance = await this.getCurrentBalance();

			logger.info(`[XRP Testnet] Current balance: ${currentBalance} XRP`);

			if (currentBalance < minBalance) {
				logger.warn(
					`[XRP Testnet] Balance below ${minBalance} XRP, requesting funds from faucet...`,
				);
				await this.fundFromFaucet();
				await this.waitForBalance(minBalance);
			}
		} finally {
			await this.client.disconnect();
		}
	}

	/**
	 * Requests funds from the XRP testnet faucet
	 */
	private async fundFromFaucet(): Promise<void> {
		try {
			const response = await fetch(this.faucetUrl, {
				method: HttpMethod.POST,
				headers: {
					"Content-Type": ContentType.JSON,
				},
				body: JSON.stringify({
					destination: this.wallet.address,
				}),
			});

			if (!response.ok) {
				throw new Error(
					`Faucet request failed: ${response.statusText}`,
				);
			}

			const data = (await response.json()) as FaucetResponse;
			logger.info(`[XRP Testnet] Faucet request successful`, {
				amount: data.amount,
				balance: data.balance,
			});
		} catch (error) {
			logger.error(
				`[XRP Testnet] Faucet request failed:`,
				this.getErrorMessage(error),
			);
			throw new XrpTestnetFundingError(
				`Failed to fund wallet from faucet: ${this.getErrorMessage(
					error,
				)}. ` +
					`Manual funding required at: https://xrpl.org/resources/dev-tools/xrp-faucets`,
				this.wallet.address,
			);
		}
	}

	/**
	 * Waits for wallet balance to reach minimum threshold
	 */
	private async waitForBalance(minBalance: number): Promise<void> {
		await this.connect();

		try {
			await waitUntil(
				async () => {
					const currentBalance = await this.getCurrentBalance();

					logger.info(
						`[XRP Testnet] Waiting for funds... Current: ${currentBalance} XRP`,
					);

					return currentBalance >= minBalance;
				},
				{
					errorMessage: `Wallet not funded after faucet request`,
					intervalSeconds: TimeoutSeconds.TWO,
					timeoutSeconds: TimeoutSeconds.THIRTY,
				},
			);

			const finalBalance = await this.getCurrentBalance();
			logger.info(
				`[XRP Testnet] Wallet funded successfully: ${finalBalance} XRP`,
			);
		} catch (error) {
			if (error instanceof XrpTestnetConnectionError) {
				throw error;
			}
			throw new XrpTestnetFundingError(
				`Timeout waiting for faucet funds to arrive`,
				this.wallet.address,
			);
		} finally {
			await this.client.disconnect();
		}
	}

	/**
	 * Sends XRP from the test wallet to a destination address with a destination tag.
	 * Automatically ensures wallet is funded before sending.
	 *
	 * @param destinationAddress - The XRP address to send to
	 * @param amount - Amount of XRP to send (as string, e.g., "0.05")
	 * @param destinationTag - The destination tag for routing
	 * @returns Transaction hash and ID
	 */
	public async sendToAddress(
		destinationAddress: string,
		amount: string,
		destinationTag: number | string,
	): Promise<{ id: string; txHash: string }> {
		const requiredBalance = Number(amount) + 1;
		await this.ensureFunded(requiredBalance);

		logger.info(`[XRP Testnet] Send transaction initiated`, {
			from: this.wallet.address,
			to: destinationAddress,
			amount: amount,
			tag: destinationTag,
		});

		await this.connect();

		try {
			const payment: Payment = {
				TransactionType: "Payment",
				Account: this.wallet.address,
				Destination: destinationAddress,
				Amount: xrpToDrops(amount),
				DestinationTag: Number(destinationTag),
			};

			const response = await this.client.submitAndWait(payment, {
				wallet: this.wallet,
			});

			const hash = response.result.hash;

			logger.info(`[XRP Testnet] Transaction submitted`, {
				hash: hash,
				validated: response.result.validated,
			});

			return {
				id: hash,
				txHash: hash,
			};
		} catch (error) {
			throw new XrpTestnetTransactionError(
				`Failed to send XRP transaction: ${this.getErrorMessage(
					error,
				)}`,
			);
		} finally {
			await this.client.disconnect();
		}
	}

	/**
	 * Gets transaction details by hash
	 */
	public async getTransaction(txHash: string): Promise<TransactionResult> {
		await this.connect();

		try {
			const response = await this.client.request({
				command: "tx",
				transaction: txHash,
			});

			return {
				txHash: response.result.hash,
				validated: response.result.validated ?? false,
			};
		} catch (error) {
			throw new XrpTestnetTransactionError(
				`Failed to get transaction ${txHash}: ${this.getErrorMessage(
					error,
				)}`,
				txHash,
			);
		} finally {
			await this.client.disconnect();
		}
	}

	/**
	 * Waits for transaction to be validated on the ledger
	 */
	public async waitForCompletion(txHash: string): Promise<void> {
		logger.info(`[XRP Testnet] Waiting for tx validation`, { txHash });

		try {
			await waitUntil(
				async () => {
					const tx = await this.getTransaction(txHash);
					return tx.validated === true;
				},
				{
					errorMessage: `XRP testnet tx ${txHash} not validated`,
					intervalSeconds: TimeoutSeconds.TWO,
					timeoutSeconds: TimeoutSeconds.SIXTY,
				},
			);

			logger.info(`[XRP Testnet] Transaction validated`, { txHash });
		} catch (error) {
			if (
				error instanceof XrpTestnetConnectionError ||
				error instanceof XrpTestnetTransactionError
			) {
				throw error;
			}
			throw new XrpTestnetTransactionError(
				`Timeout waiting for transaction ${txHash} to validate`,
				txHash,
			);
		}
	}

	/**
	 * Gets the wallet address (for reference)
	 */
	public getWalletAddress(): string {
		return this.wallet.address;
	}

	/**
	 * Gets the current XRP balance of the test wallet
	 */
	public async getBalance(): Promise<number> {
		await this.connect();

		try {
			return await this.getCurrentBalance();
		} finally {
			await this.client.disconnect();
		}
	}
}
