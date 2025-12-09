import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import { CountryAvailableBankPaymentMethods } from "../interfaces/domain/user-wallet-domain-interfaces";

export class UserWalletDomainData {
	public readonly countryAvailableBankPaymentMethods: CountryAvailableBankPaymentMethods =
		{
			[CountryCodeISO3166.TURKEY]: [BankPaymentMethod.HAVALE1],
			[CountryCodeISO3166.INDIA]: [
				BankPaymentMethod.HAVALE1,
				BankPaymentMethod.UPI,
			],
		};
}
