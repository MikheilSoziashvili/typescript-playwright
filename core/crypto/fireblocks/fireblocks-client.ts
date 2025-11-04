import {
	AssetResponse,
	CreateTransactionResponse,
	FireblocksSDK,
	PeerType,
	TransactionOperation,
	TransactionResponse,
	TransactionStatus,
} from "fireblocks-sdk";

import { TimeoutSeconds } from "@enums/timeout-seconds";
import { waitUntil } from "@core/utils/utils";
import {
	FireblocksTimeoutError,
	FireblocksTransactionError,
} from "@core/errors/fireblocks-errors";
import { logger } from "@logger/logger";

export class FireblocksClient {
	private readonly fireblocks: FireblocksSDK;
	private readonly assetId: string;

	constructor(fireblocks: FireblocksSDK, assetId: string) {
		this.fireblocks = fireblocks;
		this.assetId = assetId;
	}

	/**
	 * Retrieves the on-chain balance of the configured asset within a specific Fireblocks vault account.
	 *
	 * @param vaultAccountId - The Fireblocks vault ID (stringified automatically by FireblocksSDK if needed).
	 * @returns A Promise resolving to the asset balance (`AssetResponse`) including fields like `total`, `available`, `lockedAmount`, etc.
	 *
	 */
	public async getBalance(vaultAccountId: string): Promise<AssetResponse> {
		return this.fireblocks.getVaultAccountAsset(
			vaultAccountId,
			this.assetId,
		);
	}

	/**
	 * Sends funds from a Fireblocks vault account to an external blockchain address.
	 *
	 * This triggers a Fireblocks transaction of type `TRANSFER`. The transaction goes through Fireblocks
	 * policy checks and may require approvals depending on workspace configuration.
	 *
	 * If Fireblocks rejects the transaction (invalid address, policy blocked, etc.),
	 * a `FireblocksTransactionError` is thrown instead of leaking Axios errors.
	 *
	 * @param vaultAccountId - The source vault account ID holding the asset.
	 * @param destinationAddress - The blockchain address to send funds to (one-time address).
	 * @param amount - Amount to transfer (must be a string, not a number, per Fireblocks API).
	 *
	 * @returns A Promise resolving to a `CreateTransactionResponse`, containing the Fireblocks transaction ID.
	 */
	public async sendToAddress(
		vaultAccountId: string,
		destinationAddress: string,
		amount: string,
	): Promise<CreateTransactionResponse> {
		logger.info(`[Fireblocks] Send transaction initiated`, {
			assetId: this.assetId,
			vaultId: vaultAccountId,
			amount: amount,
			to: destinationAddress,
		});

		return this.safeFireblocksCall(() =>
			this.fireblocks.createTransaction({
				operation: TransactionOperation.TRANSFER,
				assetId: this.assetId,
				amount: amount,
				source: {
					type: PeerType.VAULT_ACCOUNT,
					id: vaultAccountId,
				},
				destination: {
					type: PeerType.ONE_TIME_ADDRESS,
					oneTimeAddress: {
						address: destinationAddress,
					},
				},
			}),
		);
	}

	/**
	 * Fetches the current status and details for a Fireblocks transaction.
	 *
	 * @param txId - Fireblocks transaction ID (returned by `sendToAddress`).
	 * @returns A Promise resolving to the full transaction data (`TransactionResponse`).
	 *
	 */
	public async getTransaction(txId: string): Promise<TransactionResponse> {
		return this.fireblocks.getTransactionById(txId);
	}

	/**
	 * Waits until a Fireblocks transaction reaches a final status (`COMPLETED`, `FAILED`, or `REJECTED`).
	 *
	 * This method uses the project's `waitUntil` polling helper to repeatedly fetch the transaction and
	 * stops when Fireblocks returns a final state. Errors are thrown using custom Fireblocks error types.
	 *
	 * @param txId - The Fireblocks transaction ID to wait on.
	 * @returns A Promise resolving to the final `TransactionResponse`.
	 *
	 * @throws FireblocksTimeoutError - If the transaction never reaches a final status.
	 * @throws FireblocksTransactionError - If Fireblocks marks the transaction as FAILED.
	 */
	public async waitForCompletion(txId: string): Promise<TransactionResponse> {
		const finalTx = await this.pollUntilFinalState(txId);
		this.handleFinalTransaction(finalTx, txId);
		return finalTx;
	}

	private async pollUntilFinalState(
		txId: string,
	): Promise<TransactionResponse> {
		let finalTx: TransactionResponse | undefined;

		await waitUntil(
			async () => {
				const tx = await this.getTransaction(txId);

				if (this.isFinalStatus(tx.status)) {
					finalTx = tx;
					return true;
				}
				return false;
			},
			{
				errorMessage: `Fireblocks tx ${txId} did not reach final state`,
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.FOUR_EIGHTY,
			},
		);

		return this.ensureFinalTransactionExists(finalTx, txId);
	}

	private handleFinalTransaction(
		tx: TransactionResponse,
		txId: string,
	): void {
		if (tx.status === TransactionStatus.FAILED) {
			logger.error(`[Fireblocks] Transaction FAILED`, {
				txId: txId,
				status: tx.status,
			});
			throw new FireblocksTransactionError(
				`Fireblocks transaction failed`,
				txId,
			);
		}

		logger.info(`[Fireblocks] Tx COMPLETED`, {
			txId: txId,
			status: tx.status,
		});
	}

	private ensureFinalTransactionExists(
		tx: TransactionResponse | undefined,
		txId: string,
	): TransactionResponse {
		if (!tx) {
			logger.error(`[Fireblocks] Timeout waiting for tx`, { txId: txId });
			throw new FireblocksTimeoutError(
				`waitForCompletion: no final transaction returned for tx ${txId}`,
				txId,
			);
		}
		return tx;
	}

	private isFinalStatus(status: TransactionStatus): boolean {
		return (
			status === TransactionStatus.COMPLETED ||
			status === TransactionStatus.FAILED ||
			status === TransactionStatus.REJECTED
		);
	}

	private async safeFireblocksCall<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn();
		} catch {
			throw new FireblocksTransactionError(
				"Fireblocks rejected the transaction",
			);
		}
	}
}
