import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import {
	createEthClient,
	createUsdtClient,
} from "@core/crypto/fireblocks/fireblocks-factory";
import { UtxoNodeClient } from "@core/crypto/utxo/utxo-client";
import { XrpTestnetClient } from "@core/crypto/xrp/xrp-testnet-client";
import { createXrpTestnetClient } from "@core/crypto/xrp/xrp-testnet-factory";
import { test as base } from "@playwright/test";

export type CryptoClients = {
	usdtClient: FireblocksClient;
	ethClient: FireblocksClient;
	xrpTestnetClient: XrpTestnetClient;
	btcClient: UtxoNodeClient;
	ltcClient: UtxoNodeClient;
};

export const cryptoFixtures = base.extend<CryptoClients>({
	usdtClient: async ({}, use) => {
		await use(createUsdtClient());
	},

	xrpTestnetClient: async ({}, use) => {
		await use(createXrpTestnetClient());
	},
	btcClient: async ({}, use) => {
		await use(UtxoNodeClient.bitcoin());
	},
	ltcClient: async ({}, use) => {
		await use(UtxoNodeClient.litecoin());
	},
	ethClient: async ({}, use) => {
		await use(createEthClient());
	},
});
