import { Currency } from "@enums/currencies";
import { RequestType } from "@enums/request-type";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

export type PlaceBetRequest = {
	type: RequestType;
	arg: {
		walletInfo: {
			amount: number;
			unit: Unit;
			displayCurrency: Currency;
			wallet_type: WalletType;
		};
		autoCashOut: number;
	};
};
