import { PocketDiceApiRollType } from "@enums/pocket-dice-api-enums";

export type PocketDicePlaceBetResponse = {
	id: string;
	rollType: PocketDiceApiRollType;
	betOn: number;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	multiplier: number;
	nonce: number;
	nextBetNonce: number;
	unit: string;
	wallet: {
		balanceInUnit: number;
		info: {
			displayCurrency: string;
			unit: string;
			unitToUSD: number;
			usdToDisplayCurrency: number;
		};
	};
	state: {
		rounds: unknown[];
		result: number[];
	};
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
