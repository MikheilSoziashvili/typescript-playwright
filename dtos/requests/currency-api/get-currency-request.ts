import { WalletUnit } from "@core/types/types";
import { Currency } from "@enums/currencies";

export type GetCurrencyRequest = {
	displayCurrency: Currency;
	walletUnit: WalletUnit;
};
