import { CoinGeckoApi } from "@api/coingecko-api";
import { GamdomApi } from "@api/gamdom-api";
import { GamdomCryptoApi } from "@api/gamdom-crypto-api";
import { MailinatorApi } from "@api/mailinator-api";
import { GamdomApiAsserter } from "@core/api/asserters/gamdom-api-asserter";
import { test as base } from "@playwright/test";
import * as Configuration from "../configuration";
import { VeriffApi } from "@api/veriff-api";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApi: GamdomApi;
	gamdomCryptoApi: GamdomCryptoApi;
	coingeckoApi: CoinGeckoApi;
	gamdomApiAsserter: GamdomApiAsserter;
	veriffApi: VeriffApi;
};

export const apisFixtures = base.extend<Apis>({
	mailinatorApi: async ({}, use) => {
		await use(new MailinatorApi(Configuration.mailinator));
	},
	gamdomApi: async ({}, use) => {
		await use(new GamdomApi());
	},
	gamdomCryptoApi: async ({}, use) => {
		await use(new GamdomCryptoApi());
	},
	coingeckoApi: async ({}, use) => {
		await use(new CoinGeckoApi());
	},
	gamdomApiAsserter: async ({}, use) => {
		await use(new GamdomApiAsserter());
	},
	veriffApi: async ({}, use) => {
		await use(new VeriffApi());
	},
});
