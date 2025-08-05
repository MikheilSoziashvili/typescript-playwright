import { test as base } from "@playwright/test";
import { MailinatorApi } from "@api/mailinator-api";
import * as Configuration from "../configuration";
import { GamdomApi } from "@api/gamdom-api";
import { CoinGeckoApi } from "@api/coingecko-api";
import { BitcoinApi } from "@api/bitcoin-api";
import { GamdomApiAsserter } from "@core/api/asserters/gamdom-api-asserter";

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
