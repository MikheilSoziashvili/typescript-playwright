import { DEFAULT_CURRENCY } from "../../../constants/defaults";
import { buildAmountWithCurrency } from "../../utils";

export function buildClaimedAmountSubTitle(
	amount: number,
	currency = DEFAULT_CURRENCY,
): string {
	const subTitle = `You have successfully claimed ${buildAmountWithCurrency(
		amount,
		currency,
	)}!`;

	return subTitle;
}

export function buildTipUserSubTitle(params: {
	username: string;
	tipAmount: number;
	currency?: string;
}): string {
	const currency = params.currency ?? DEFAULT_CURRENCY;
	const message = `You have given ${
		params.username
	} a tip of ${buildAmountWithCurrency(params.tipAmount, currency)}.`;

	return message;
}

export function buildTipUserMessageInfo(params: {
	senderUsername: string;
	receiverUsername: string;
	tipAmount: number;
	currency?: string;
}): string {
	const currency = params.currency ?? DEFAULT_CURRENCY;
	const message = `${
		params.senderUsername
	} just gave ${buildAmountWithCurrency(params.tipAmount, currency)} to ${
		params.receiverUsername
	}`;

	return message;
}
