import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";

export interface CountryAvailableBankPaymentMethods {
	[CountryCodeISO3166.TURKEY]: BankPaymentMethod[];
	[CountryCodeISO3166.INDIA]: BankPaymentMethod[];
}

export interface BankWithdrawScenario {
	country: CountryCodeISO3166;
	bankPaymentMethod: BankPaymentMethod;
}
