import { UtxoNodeClient } from "@core/crypto/utxo/utxo-client";
import { SendOptions } from "@core/types/types";
import { waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { CryptoClient } from "../types/crypto-flow-types";

export function toUtxoCryptoClient(
	utxoClient: UtxoNodeClient,
	sendOptions?: SendOptions,
): CryptoClient {
	return {
		sendToAddress: async (address: string, amount: string) => {
			const response = await utxoClient.sendToAddress(
				address,
				parseFloat(amount),
				sendOptions,
			);
			return { id: response.result };
		},
		waitForCompletion: async (id: string) => {
			await waitUntil(
				async () => {
					const { result } = await utxoClient.getTransaction(id);
					if (result.confirmations > 0) {
						logger.info(`[UTXO] Transaction ${id} confirmed`);
						return true;
					}
					return false;
				},
				{
					errorMessage: `UTXO transaction ${id} not confirmed`,
					intervalSeconds: Timeout.EXTRA_LONG / 1000,
					timeoutSeconds: Timeout.SUPER_MAX / 1000,
				},
			);
		},
		getTransaction: async (id: string) => {
			const response = await utxoClient.getTransaction(id);
			return { txHash: response.result.txid };
		},
	};
}
