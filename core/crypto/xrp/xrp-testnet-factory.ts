import { XrpTestnetConfigError } from "@core/errors/xrp-testnet-errors";
import { XrpTestnetClient } from "./xrp-testnet-client";
import { xrpTestnet } from "configuration";

export function createXrpTestnetClient(): XrpTestnetClient {
	if (!xrpTestnet.walletSeed) {
		throw new XrpTestnetConfigError(
			"Missing XRP_TESTNET_WALLET_SEED environment variable. " +
				"Generate one at https://xrpl.org/resources/dev-tools/xrp-faucets",
		);
	}

	return new XrpTestnetClient(
		xrpTestnet.walletSeed,
		xrpTestnet.rpcUrl,
		xrpTestnet.faucetUrl,
	);
}
