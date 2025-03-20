import { BitcoinApi } from "@api/bitcoin-api";
import { waitUntil } from "@core/utils/utils";
import { logger } from "@logger/logger";

/**
 * Waits for a Bitcoin transaction to be confirmed.
 * @param bitcoinApi Instance of BitcoinApi to fetch transaction details.
 * @param transactionId The ID of the transaction to check.
 */
export async function waitBtcTransactionConfirmation(
	bitcoinApi: BitcoinApi,
	transactionId: string,
): Promise<void> {
	await waitUntil(
		async () => {
			const txResponse = await bitcoinApi.getTransaction(transactionId);
			const confirmations = txResponse.result.confirmations;
			logger.info(
				`Polling for confirmations of transaction with id: ${transactionId}`,
			);

			if (confirmations > 0) {
				logger.info(`Transaction ${transactionId} is now confirmed!`);
				return true;
			}

			return false;
		},
		{
			errorMessage: `Transaction ${transactionId} was not confirmed in time`,
			intervalSeconds: 20,
			timeoutSeconds: 1200,
		},
	);
}
