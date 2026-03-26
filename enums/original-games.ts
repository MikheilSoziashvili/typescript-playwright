/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum OriginalGame {
	Crash = "Crash",
	Dice = "Dice",
	Roulette = "Roulette",
	HiLo = "HiLo",
	Plinko = "Plinko",
	Mines = "Mines",
	Keno = "Keno",
	PocketDice = "PocketDice",
	Limbo = "Limbo",
	Blackjack = "Blackjack",
}

export enum RouletteNumberColor {
	GREEN = 0,
	RED = 50,
	BLACK = 100,
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

export enum MinBetAmount {
	PLINKO = 0.1,
	MINES = 0.01,
	KENO = PLINKO,
}

export enum MaxBetAmount {
	PLINKO = 2500,
	MINES = 200000,
	KENO = MINES,
}

export enum OriginalsHandlerMethods {
	SetBetAmount = "setBetAmount",
	TypeBetAmount = "typeBetAmount",
	PressMinButton = "pressMinButton",
	PressHalfButton = "pressHalfButton",
	PressMaxButton = "pressMaxButton",
	PressDoubleButton = "pressDoubleButton",
	GetBetAmountValue = "getBetAmountValue",
}

export enum OriginalsQuickSelectButtons {
	MIN = "MIN",
	HALF = "HALF",
	MAX = "MAX",
	DOUBLE = "DOUBLE",
}

export enum ExpectedWins {
	ONE = 1,
	FIVE = 5,
	TEN = 10,
	FIFTEEN = 15,
}
