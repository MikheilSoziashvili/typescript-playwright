import { OriginalGame } from "@enums/original-games";

export const ORIGINALS_GAME_HOUSE_EDGE: Record<string, number> = {
	[OriginalGame.Dice]: 0.005,
	[OriginalGame.Crash]: 0.005,
	[OriginalGame.Roulette]: 0.005,
	[OriginalGame.HiLo]: 0.005,
	[OriginalGame.Plinko]: 0.005,
	[OriginalGame.Mines]: 0.005,
	[OriginalGame.Keno]: 0.005,
	[OriginalGame.PocketDice]: 0.005,
	[OriginalGame.Limbo]: 0.005,
	[OriginalGame.Blackjack]: 0.00345,
};

export const SPORTSBET_HOUSE_EDGE = 0.03;

export const KOTH_BASELINE_NORMALIZATION_CONSTANT = 0.035;

export const GAME_HOUSE_EDGE: Record<string, number> = {
	...ORIGINALS_GAME_HOUSE_EDGE,
};
