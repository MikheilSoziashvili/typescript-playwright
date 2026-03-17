import { BankPaymentMethod } from "@enums/bank-payment-methods";

export const bankPaymentMethodLabelMap: Record<BankPaymentMethod, string> = {
	[BankPaymentMethod.HAVALE]: "Havale 1",
	[BankPaymentMethod.HAVALE1]: "Havale 2",
	[BankPaymentMethod.PAYIXI]: "PayIXI",
	[BankPaymentMethod.PAPARA]: "Papara",
	[BankPaymentMethod.UPI]: "UPI",
};
