import { Currency } from "@enums/currencies";
import { RequestType } from "@enums/request-type";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

export type HiloPlaceBetRequest = {
	type: RequestType;
	arg: {
		betOption: string;
		is_autobet: boolean;
		walletInfo: {
			amount: number;
			unit: Unit;
			displayCurrency: Currency;
			wallet_type: WalletType;
		};
	};
};
