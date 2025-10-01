import { BitcoinApi } from "@api/bitcoin-api";
import { pollOrSkip } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { TestInfo } from "@playwright/test";

/**
 * Waits for a Bitcoin transaction to be confirmed.
 * Skips the test if it doesn't confirm within the timeout.
 */
export async function waitBtcTransactionConfirmation(
	bitcoinApi: BitcoinApi,
	transactionId: string,
	testInfo: TestInfo,
): Promise<void> {
	const timeout = Timeout.SUPER_MAX;
	const interval = Timeout.EXTRA_LONG;
	const reason = `Transaction ${transactionId} not confirmed`;

	await pollOrSkip(
		async () => {
			const { result } = await bitcoinApi.getTransaction(transactionId);
			if (result.confirmations > 0) {
				logger.info(`Transaction ${transactionId} is confirmed!`);
				return true;
			}
			return false;
		},
		{
			timeout,
			interval,
			reason,
			testInfo,
		},
	);
}
