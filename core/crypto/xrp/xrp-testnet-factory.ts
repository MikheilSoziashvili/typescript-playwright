import { XrpTestnetConfigError } from "@core/errors/xrp-testnet-errors";
import { xrpTestnet } from "configuration";
import { XrpTestnetClient } from "./xrp-testnet-client";

export function createXrpTestnetClient(workerIndex: number): XrpTestnetClient {
	const walletSeeds = [
		xrpTestnet.walletSeedWorker0,
		xrpTestnet.walletSeedWorker1,
		xrpTestnet.walletSeedWorker2,
		xrpTestnet.walletSeedWorker3,
		xrpTestnet.walletSeedWorker4,
	];

	const walletIndex = workerIndex % walletSeeds.length;
	const walletSeed = walletSeeds[walletIndex];

	if (!walletSeed) {
		throw new XrpTestnetConfigError(
			`Missing XRP_TESTNET_WALLET_SEED_WORKER_${walletIndex} environment variable. ` +
				`Set XRP_TESTNET_WALLET_SEED_WORKER_0 through XRP_TESTNET_WALLET_SEED_WORKER_4 in your .env file.`,
		);
	}

	return new XrpTestnetClient(
		walletSeed,
		xrpTestnet.rpcUrl,
		xrpTestnet.faucetUrl,
	);
}
