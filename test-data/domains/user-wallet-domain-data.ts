import { BankPaymentMethod } from "@enums/bank-payment-methods";
import { CountryCodeISO3166 } from "@enums/country-codes-iso3166";
import {
	BankWithdrawScenario,
	CountryAvailableBankPaymentMethods,
} from "../interfaces/domain/user-wallet-domain-interfaces";

export class UserWalletDomainData {
	public readonly countryAvailableBankPaymentMethods: CountryAvailableBankPaymentMethods =
		{
			[CountryCodeISO3166.TURKEY]: [
				BankPaymentMethod.HAVALE,
				BankPaymentMethod.HAVALE1,
				BankPaymentMethod.PAYIXI,
				BankPaymentMethod.PAPARA,
			],
			[CountryCodeISO3166.INDIA]: [BankPaymentMethod.UPI],
		};

	public readonly bankWithdrawScenarios: BankWithdrawScenario[] =
		Object.entries(this.countryAvailableBankPaymentMethods).flatMap(
			([country, methods]: [string, BankPaymentMethod[]]) =>
				methods.map((bankPaymentMethod) => ({
					country: country as CountryCodeISO3166,
					bankPaymentMethod: bankPaymentMethod,
				})),
		);
}
