export type GameUrlRequest = {
	gameCode: string;
	demo: boolean;
	mobile: boolean;
	lang: string;
	walletInfo: {
		amount: number;
		unit: string;
		displayCurrency: string;
		wallet_type: string;
	};
};
