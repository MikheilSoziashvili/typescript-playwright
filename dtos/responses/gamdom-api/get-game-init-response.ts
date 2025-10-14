import { WalletUnit } from "@core/types/types";
import { Currency } from "@enums/currencies";

export type GetGameInitResponse = {
	wallet: {
		info: {
			/** The currency the UI should display, e.g., "EUR" */
			displayCurrency: Currency;

			/** Wallet unit used by originals, typically "COINS" */
			unit: WalletUnit;

			/**
			 * Conversion rate from the internal wallet unit to USD.
			 */
			unitToUSD: number;

			/**
			 * Conversion rate from USD to the currently selected display currency.
			 */
			usdToDisplayCurrency: number;
		};
	};
};
