import { BlackjackApi } from "./games-api/blackjack-api";
import { GamdomApi } from "./gamdom-api";
import { CoinGeckoApi } from "./coingecko-api";
import { CurrencyApi } from "./currency-api";
import { GamdomCryptoApi } from "./gamdom-crypto-api";
import { CrashApi } from "./games-api/crash-api";
import { DiceApi } from "./games-api/dice-api";
import { HiloApi } from "./games-api/hilo-api";
import { KenoApi } from "./games-api/keno-api";
import { MinesApi } from "./games-api/mines-api";
import { PlinkoApi } from "./games-api/plinko-api";
import { PocketDiceApi } from "./games-api/pocket-dice-api";
import { RouletteApi } from "./games-api/roulette-api";
import { Page } from "@playwright/test";
import { LimboApi } from "./games-api/limbo-api";

export const AllApis = {
	blackjackApi: BlackjackApi,
	coinGeckoApi: CoinGeckoApi,
	crashApi: CrashApi,
	currencyApi: CurrencyApi,
	diceApi: DiceApi,
	hiloApi: HiloApi,
	kenoApi: KenoApi,
	limboApi: LimboApi,
	minesApi: MinesApi,
	plinkoApi: PlinkoApi,
	pocketDiceApi: PocketDiceApi,
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
