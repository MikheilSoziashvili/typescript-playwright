import { Currency } from "@enums/currencies";
import { CurrencySymbol } from "@enums/currenciesSymbols";

export type GetCurrencyResponse = {
	/** The crypto price in USD (e.g. 0.11 USD for 1 cryptocurrency) */
	cryptoPrice: string;

	/** The fiat currency name (e.g. "EUR") */
	name: Currency;

	/** The conversion rate of this fiat against USD (e.g. 0.95 EUR = 1 USD) */
	rate: string;

	/** The symbol of the fiat currency (e.g. "€") */
	symbol: CurrencySymbol;
};
