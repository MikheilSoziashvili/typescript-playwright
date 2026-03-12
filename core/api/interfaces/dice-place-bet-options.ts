import { Currency } from "@enums/currencies";
import { DiceRollType } from "@enums/dice-roll-type";
import { Unit } from "@enums/units";
import { WalletType } from "@enums/wallet-types";

export interface DicePlaceBetOptions {
	rollType?: DiceRollType;
	rollOver?: number;
	isAutobet?: boolean;
	unit?: Unit;
	displayCurrency?: Currency;
	walletType?: WalletType;
	headers?: Record<string, string>;
}
