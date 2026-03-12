import { CoinGeckoApi } from "@api/coingecko-api";
import { GamdomApi } from "@api/gamdom-api";
import { GamdomCryptoApi } from "@api/gamdom-crypto-api";
import { CrashApi } from "@api/games-api/crash-api";
import { DiceApi } from "@api/games-api/dice-api";
import { HiloApi } from "@api/games-api/hilo-api";
import { RouletteApi } from "@api/games-api/roulette-api";
import { MailinatorApi } from "@api/mailinator-api";
import { GamdomApiAsserter } from "@core/api/asserters/gamdom-api-asserter";
import { test as base } from "@playwright/test";
import * as Configuration from "../configuration";
import { VeriffApi } from "@api/veriff-api";

export type Apis = {
	mailinatorApi: MailinatorApi;
	gamdomApi: GamdomApi;
	gamdomCryptoApi: GamdomCryptoApi;
	crashApi: CrashApi;
	diceApi: DiceApi;
	hiloApi: HiloApi;
	rouletteApi: RouletteApi;
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
	crashApi: async ({}, use) => {
		await use(new CrashApi());
	},
	diceApi: async ({}, use) => {
		await use(new DiceApi());
	},
	hiloApi: async ({}, use) => {
		await use(new HiloApi());
	},
	rouletteApi: async ({}, use) => {
		await use(new RouletteApi());
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
