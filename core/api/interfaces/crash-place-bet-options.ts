import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

export interface CrashPlaceBetOptions {
	unit?: Unit;
	displayCurrency?: Currency;
	walletType?: WalletType;
	headers?: Record<string, string>;
}
