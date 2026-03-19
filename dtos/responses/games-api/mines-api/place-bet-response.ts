export type MinesPlaceBetResponse = {
	id: string;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	nonce: number;
	nextBetNonce: number;
	minesCount: number;
	unit: string;
	finished: boolean;
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
		mines: number[] | null;
		rounds: unknown[];
	};
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
