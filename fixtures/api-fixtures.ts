import { BitcoinApi } from "@api/bitcoin-api";
import { CoinGeckoApi } from "@api/coingecko-api";
import { GamdomApi } from "@api/gamdom-api";
import { MailinatorApi } from "@api/mailinator-api";
import { GamdomApiAsserter } from "@core/api/asserters/gamdom-api-asserter";
import { test as base } from "@playwright/test";
import * as Configuration from "../configuration";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApi: GamdomApi;
	coingeckoApi: CoinGeckoApi;
	bitcoinApi: BitcoinApi;
	gamdomApiAsserter: GamdomApiAsserter;
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
	bitcoinApi: async ({}, use) => {
		await use(new BitcoinApi());
	},
	gamdomApiAsserter: async ({}, use) => {
		await use(new GamdomApiAsserter());
	},
});
