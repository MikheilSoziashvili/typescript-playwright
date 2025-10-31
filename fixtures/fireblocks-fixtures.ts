import { FireblocksClient } from "@core/crypto/fireblocks/fireblocks-client";
import { createUsdtClient } from "@core/crypto/fireblocks/fireblocks-factory";
import { test as base } from "@playwright/test";

export type FireblocksClients = {
	usdtClient: FireblocksClient;
};

export const fireblocksFixtures = base.extend<FireblocksClients>({
	usdtClient: async ({}, use) => {
		await use(createUsdtClient());
	},
});
