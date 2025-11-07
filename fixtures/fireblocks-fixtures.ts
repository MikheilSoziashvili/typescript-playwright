import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import { createUsdtClient } from "@core/crypto/fireblocks/fireblocks-factory";
import { XrpTestnetClient } from "@core/crypto/xrp/xrp-testnet-client";
import { createXrpTestnetClient } from "@core/crypto/xrp/xrp-testnet-factory";
import { test as base } from "@playwright/test";

export type CryptoClients = {
	usdtClient: FireblocksClient;
	xrpClient: FireblocksClient;
	xrpTestnetClient: XrpTestnetClient;
};

export const cryptoFixtures = base.extend<CryptoClients>({
	usdtClient: async ({}, use) => {
		await use(createUsdtClient());
	},

	xrpTestnetClient: async ({}, use) => {
		await use(createXrpTestnetClient());
	},
});
