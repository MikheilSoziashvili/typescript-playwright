import { PlinkoRisk } from "@enums/plinko/plinko-risk";

export type PlinkoPlaceBetResponse = {
	id: string;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	bucket: number;
	multiplier: number;
	nonce: number;
	nextBetNonce: number;
	balanceInUnit: number;
	risk: PlinkoRisk;
	rows: number;
	point: number;
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
