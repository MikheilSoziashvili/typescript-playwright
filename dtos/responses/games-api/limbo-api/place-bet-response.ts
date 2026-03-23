export type LimboPlaceBetResponse = {
	id: string;
	betCoins: number;
	betInUnit: number;
	winCoins: number;
	winInUnit: number;
	multiplier: number;
	targetMultiplier: number;
	resultMultiplier: number;
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
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
