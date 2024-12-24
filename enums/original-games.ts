/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum OriginalGame {
	Crash = "Crash",
	Dice = "Dice",
	Roulette = "Roulette",
	HiLo = "HiLo",
}

export enum RouletteNumberColor {
	RED = 7,
	GREEN = 0,
	BLACK = 14,
}

export enum RouletteBetColor {
	RED = "red",
	GREEN = "green",
	BLACK = "black",
}

export enum HiloBetMultiplierByBetOption {
	RED = 2,
	BLACK = 2,
	SMALL_NUMBER = 1.5,
	SYMBOL = 1.5,
	BIG_SYMBOL = 3,
	ACE = 6,
	JOKER = 24,
}
