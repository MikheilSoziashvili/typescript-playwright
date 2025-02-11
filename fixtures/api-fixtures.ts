import { test as base } from "@playwright/test";
import { MailinatorApi } from "@api/mailinator-api";
import * as Configuration from "../configuration";
import { GamdomApi } from "@api/gamdom-api";
import { CoinGeckoApi } from "@api/coingecko-api";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApi: GamdomApi;
	coingeckoApi: CoinGeckoApi;
};

export const apisFixtures = base.extend<Apis>({
	mailinatorApi: async ({}, use) => {
		await use(new MailinatorApi(Configuration.mailinator));
	},
	gamdomApi: async ({}, use) => {
		await use(new GamdomApi());
	},
	coingeckoApi: async ({}, use) => {
		await use(new CoinGeckoApi());
	},
});
