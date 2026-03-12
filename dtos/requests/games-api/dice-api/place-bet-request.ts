import { Currency } from "@enums/currencies";
import { DiceRollType } from "@enums/dice-roll-type";
import { RequestType } from "@enums/request-type";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

export type PlaceBetRequest = {
	type: RequestType;
	arg: {
		rollType: DiceRollType;
		rollOver: number;
		walletInfo: {
			amount: number;
			unit: Unit;
			displayCurrency: Currency;
			wallet_type: WalletType;
		};
		isAutobet: boolean;
	};
};
