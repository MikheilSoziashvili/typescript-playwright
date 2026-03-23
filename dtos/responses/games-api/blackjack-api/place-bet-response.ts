type BlackjackCard = {
	suit: string;
	value: number;
	short: string;
};

type BlackjackDealerHand = {
	status: string;
	firstCard: BlackjackCard | null;
	cards: BlackjackCard[];
};

type BlackjackPlayerHand = {
	finished: boolean;
	isInsurance: boolean;
	insuranceDecided: boolean;
	busted: boolean;
	betAmount: number;
	cards: BlackjackCard[];
	total: number;
};

export type BlackjackPlaceBetResponse = {
	id: string;
	betCoins: number;
	betInUnit: number;
	baseBetInUnit: number;
	winCoins: number;
	winInUnit: number;
	nonce: number;
	nextBetNonce: number;
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
		dealerHand: BlackjackDealerHand;
		playerHands: BlackjackPlayerHand[];
	};
	limits: {
		minBet: number;
		maxBet: number;
		maxWin: number;
	};
};
