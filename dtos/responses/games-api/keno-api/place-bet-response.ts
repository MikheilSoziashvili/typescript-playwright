import { KenoRisk } from "@enums/keno/keno-risk";

export type KenoPlaceBetResponse = {
	id: string;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	nonce: number;
	nextBetNonce: number;
	balanceInUnit: number;
	risk: KenoRisk;
	state: {
		drawnNumbers: number[];
		selectedNumbers: number[];
	};
	wallet: {
		displayCurrency: string;
		unit: string;
		unitToUSD: number;
		usdToDisplayCurrency: number;
	};
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
