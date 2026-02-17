import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import { CryptoClient } from "../types/crypto-flow-types";

export function toFireblocksCryptoClient(
	fireblocksClient: FireblocksClient,
	vaultId: string,
): CryptoClient {
	return {
		sendToAddress: (address: string, amount: string) =>
			fireblocksClient.sendToAddress(vaultId, address, amount),
		waitForCompletion: (id: string) =>
			fireblocksClient.waitForCompletion(id),
		getTransaction: async (id: string) => {
			const tx = await fireblocksClient.getTransaction(id);
			return { txHash: tx.txHash };
		},
	};
}
