import { GamdomApi } from "./gamdom-api";
import { CoinGeckoApi } from "./coingecko-api";
import { CurrencyApi } from "./currency-api";
import { GamdomCryptoApi } from "./gamdom-crypto-api";
import { CrashApi } from "./games-api/crash-api";
import { HiloApi } from "./games-api/hilo-api";
import { RouletteApi } from "./games-api/roulette-api";
import { Page } from "@playwright/test";

export const AllApis = {
	coinGeckoApi: CoinGeckoApi,
	crashApi: CrashApi,
	currencyApi: CurrencyApi,
	hiloApi: HiloApi,
	rouletteApi: RouletteApi,
	gamdomApi: GamdomApi,
	gamdomCryptoApi: GamdomCryptoApi,
} as const;

export type AllApisType = typeof AllApis;

export type ApisInstances = {
	[K in keyof AllApisType]: InstanceType<AllApisType[K]>;
};

export const ApiFactories = {
	currencyApi: (page: Page) => new CurrencyApi(undefined, page),
} as const;
