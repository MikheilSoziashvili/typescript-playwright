import { BankPaymentMethod } from "@enums/bank-payment-methods";

export const bankPaymentMethodLabelMap: Record<BankPaymentMethod, string> = {
	[BankPaymentMethod.HAVALE1]: "Havale1",
	[BankPaymentMethod.UPI]: "UPI",
};
