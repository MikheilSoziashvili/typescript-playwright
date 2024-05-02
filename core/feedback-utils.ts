import { DEFAULT_CURRENCY } from "../constants/defaults";
import { parseToFloat } from "./utils";

export function buildClaimedAmountSubTitle(
	amount: number,
	currency = DEFAULT_CURRENCY,
): string {
	const subTitle = `You have successfully claimed ${currency}${parseToFloat(
		amount,
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
	} a tip of ${currency}${parseToFloat(params.tipAmount)}.`;

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
	} just gave ${currency}${parseToFloat(params.tipAmount)} to ${
		params.receiverUsername
	}`;

	return message;
}
