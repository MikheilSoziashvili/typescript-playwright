import { XrpTestnetClient } from "@core/crypto/xrp/xrp-testnet-client";
import { CryptoClient } from "../types/crypto-flow-types";

export function toXrpCryptoClient(
	xrpClient: XrpTestnetClient,
): CryptoClient {
	return {
		sendToAddress: async (
			address: string,
			amount: string,
			destinationTag?: number | string,
		) => {
			if (destinationTag === undefined) {
				throw new Error("XRP requires a destinationTag");
			}
			const result = await xrpClient.sendToAddress(
				address,
				amount,
				destinationTag,
			);
			return { id: result.id };
		},
		waitForCompletion: (id: string) => xrpClient.waitForCompletion(id),
		getTransaction: (id: string) => xrpClient.getTransaction(id),
	};
}
