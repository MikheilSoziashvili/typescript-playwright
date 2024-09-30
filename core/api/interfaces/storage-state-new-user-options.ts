import { Currency } from "@enums/currencies";

export interface StorageStateNewUserOptions {
	username?: string;
	password?: string;
	email?: string;
	amount?: number;
	unit?: string;
    displayCurrency?: Currency;  // Use the Currency enum for display currency
}
