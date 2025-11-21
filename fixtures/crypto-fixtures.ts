import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import {
	createEthClient,
	createSolClient,
	createTrxClient,
	createUsdcEthClient,
	createUsdtClient,
	createUsdtTrxClient,
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
	solClient: FireblocksClient;
	trxClient: FireblocksClient;
	usdtTrxClient: FireblocksClient;
	usdcEthClient: FireblocksClient;
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
	solClient: async ({}, use) => {
		await use(createSolClient());
	},
	trxClient: async ({}, use) => {
		await use(createTrxClient());
	},
	usdtTrxClient: async ({}, use) => {
		await use(createUsdtTrxClient());
	},
	usdcEthClient: async ({}, use) => {
		await use(createUsdcEthClient());
	},
});
