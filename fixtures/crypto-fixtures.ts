import { DogeTestnetClient } from "@core/crypto/doge/doge-testnet-client";
import { createDogeTestnetClient } from "@core/crypto/doge/doge-testnet-factory";
import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import {
	createBnbClient,
	createEthClient,
	createSolClient,
	createTrxClient,
	createUsd1EthClient,
	createUsd1SolClient,
	createUsdcBscClient,
	createUsdcEthClient,
	createUsdcSolClient,
	createUsdtBscClient,
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
	usdcSolClient: FireblocksClient;
	dogeClient: DogeTestnetClient;
	usd1EthCleint: FireblocksClient;
	usd1SolClient: FireblocksClient;
	usdtBscClient: FireblocksClient;
	usdcBscClient: FireblocksClient;
	bnbClient: FireblocksClient;
};

export const cryptoFixtures = base.extend<CryptoClients>({
	usdtClient: async ({}, use) => {
		await use(createUsdtClient());
	},

	xrpTestnetClient: async ({}, use, workerInfo) => {
		await use(createXrpTestnetClient(workerInfo.workerIndex));
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
	usdcSolClient: async ({}, use) => {
		await use(createUsdcSolClient());
	},
	dogeClient: async ({}, use) => {
		await use(createDogeTestnetClient());
	},
	usd1EthCleint: async ({}, use) => {
		await use(createUsd1EthClient());
	},
	usd1SolClient: async ({}, use) => {
		await use(createUsd1SolClient());
	},
	usdtBscClient: async ({}, use) => {
		await use(createUsdtBscClient());
	},
	usdcBscClient: async ({}, use) => {
		await use(createUsdcBscClient());
	},
	bnbClient: async ({}, use) => {
		await use(createBnbClient());
	},
});
