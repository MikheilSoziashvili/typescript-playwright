export type TipUserRequest = {
	type: string;
	arg: {
		toId: number;
		walletInfo: {
			amount: number;
			unit: string;
			displayCurrency: string;
		};
	};
};
