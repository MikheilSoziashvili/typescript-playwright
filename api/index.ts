import { GamdomApi } from "./gamdom-api";
import { CoinGeckoApi } from "./coingecko-api";
import { CurrencyApi } from "./currency-api";
import { GamdomCryptoApi } from "./gamdom-crypto-api";
import { Page } from "@playwright/test";

export const AllApis = {
	coinGeckoApi: CoinGeckoApi,
	currencyApi: CurrencyApi,
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
