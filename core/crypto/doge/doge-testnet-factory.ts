import { DogeTestnetConfigError } from "@core/errors/doge-testnet-errors";
import { DogeTestnetClient } from "./doge-testnet-client";
import { dogeTestnet } from "configuration";

/**
 * Factory function to create Dogecoin testnet client
 * Similar to createXrpTestnetClient()
 */
export function createDogeTestnetClient(): DogeTestnetClient {
	if (!dogeTestnet.privateKey) {
		throw new DogeTestnetConfigError(
			"Missing DOGE_TESTNET_PRIVATE_KEY environment variable. " +
				"Generate one at https://testnet-wallet.doge.toys/ or use the HTML generator",
		);
	}

	if (!dogeTestnet.address) {
		throw new DogeTestnetConfigError(
			"Missing DOGE_TESTNET_ADDRESS environment variable. " +
				"This is your testnet wallet address (starts with 'n')",
		);
	}

	return new DogeTestnetClient(dogeTestnet.privateKey, dogeTestnet.address);
}
