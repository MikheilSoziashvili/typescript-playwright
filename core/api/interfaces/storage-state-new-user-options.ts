import { Currency } from "@enums/currencies";
import { Unit } from "@enums/units";

export interface StorageStateNewUserOptions {
	username?: string;
	password?: string;
	email?: string;
	amount?: number;
	unit?: Unit;
	displayCurrency?: Currency;
}
