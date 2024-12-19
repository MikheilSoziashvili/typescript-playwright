import { DEFAULT_CURRENCY } from "@constants/defaults";
import { buildAmountWithCurrency } from "@core/utils/utils";

export function buildClaimedAmountSubTitle(
	amount: number,
	currency = DEFAULT_CURRENCY,
): string {
	const amountWithCurrency = buildAmountWithCurrency(amount, currency);
	const subTitle = `You have successfully claimed ${amountWithCurrency}!`;

	return subTitle;
}

export function buildTipUserSubTitle(params: {
	username: string;
	tipAmount: number;
	currency?: string;
}): string {
	const currency = params.currency ?? DEFAULT_CURRENCY;
	const amountWithCurrency = buildAmountWithCurrency(
		params.tipAmount,
		currency,
	);
	const message = `You have given ${params.username} a tip of ${amountWithCurrency}.`;

	return message;
}

export function buildTipUserMessageInfo(params: {
	senderUsername: string;
	receiverUsername: string;
	tipAmount: number;
	currency?: string;
}): string {
	const currency = params.currency ?? DEFAULT_CURRENCY;
	const amountWithCurrency = buildAmountWithCurrency(
		params.tipAmount,
		currency,
	);
	const message = `${params.senderUsername} just gave ${amountWithCurrency} to ${params.receiverUsername}`;

	return message;
}

export function buildCreateAffiliateCodeSubTitle(
	affiliateCode: string,
): string {
	return `You have successfully created code ${affiliateCode}!`;
}

export function buildRewardsRoyaltyUpRankSubTitle(
	royaltyUpRank: string,
): string {
	const subTitle = `Congratulations! You ranked up to ${royaltyUpRank} rank. Your royalty reward awaits you on the rewards page.`;

	return subTitle;
}
