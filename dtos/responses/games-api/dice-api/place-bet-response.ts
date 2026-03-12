import { DiceRollType } from "@enums/dice-roll-type";

export type PlaceBetResponse = {
	id: number;
	rollType: DiceRollType;
	rollOver: number;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	didWin: boolean;
	rollResult: number;
	nonce: number;
	nextBetNonce: number;
};
