import { DEFAULT_CURRENCY } from "@constants/defaults";
import { buildAmountWithCurrency } from "@core/utils/utils";
import { AmlVerificationLevel } from "@enums/db/aml-verification-level";

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

export function buildIgnoreUserMessageInfo(params: {
	ignoredUser: string;
}): string {
	const message = `User ${params.ignoredUser} ignored`;
	return message;
}

export function buildTipRainUserMessageInfo(params: {
	username: string;
	tipRainAmount: number;
	currency?: string;
}): string {
	const amountWithCurrency = buildAmountWithCurrency(
		params.tipRainAmount,
		params.currency ?? DEFAULT_CURRENCY,
	);
	const message = `${params.username} has tipped ${amountWithCurrency} to the next free rain!`;

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

export function buildCreatedCampaignSubTitle(campaignName: string): string {
	return `Campaign ${campaignName} - created`;
}

export function buildNewRedirectFromToSubTitle(
	redirectFrom: string,
	redirectTo: string,
): string {
	return `New redirect has been created from ${redirectFrom} to ${redirectTo}`;
}

export function buildEditedRedirectFromToSubTitle(
	redirectFrom: string,
	redirectTo: string,
): string {
	return `Redirect has been updated from ${redirectFrom} to ${redirectTo}`;
}

export function buildDeletedRedirectFromSubTitle(redirectFrom: string): string {
	return `Redirect deleted successfully from: ${redirectFrom}.`;
}

export function buildCashPromoCodeTransactionsDetailsValue(
	promoCampaignName: string,
	amount = 100,
): string {
	return `Promo code activated, code: ${promoCampaignName}, reward type: cash, amount: $${amount}`;
}

export function buildFreeSpinsPromoCodeTransactionsDetailsValue(
	promoCampaignName: string,
	freeSpins = 10,
	amount = 0.1,
): string {
	return `Promo code activated, code: ${promoCampaignName}, reward type: free_spins, ${freeSpins} FS x ${amount} for wicked_bookofarabia`;
}

export function buildInformationalCashPromoCodeTransactionsDetailsValue(): string {
	return `Unknown Transaction Details (deleted data) - informational_promo_win_cash - promo_codes.campaigns:`;
}

export function generateAmlVerificationReasonText(
	levelNum: AmlVerificationLevel,
): string {
	return `Reason for level ${levelNum} verification`;
}

export function generateAmlVerificationStatusReasonText(
	levelNum: AmlVerificationLevel,
	status: string,
): string {
	return `Reason for level ${levelNum} - ${status}`;
}

export function buildFreeSpinsPromoCodeNotificationSubTitle(
	freeSpinsAmount: number,
	freeSpinValue: number,
	expirationDate: string,
	gameName: string,
): string {
	return `Congratulations! You have redeemed ${freeSpinsAmount} Free Spins ($${freeSpinValue} each) free bets for ${gameName}! This promo will expire at ${expirationDate} if you don't use it.`;
}

export function buildCashPromoCodeNotificationSubTitle(amount: number): string {
	return `Congratulations! You have redeemed $${amount}.`;
}

export function buildSendingOutFreeSpinsToastSubTitle(userId: number): string {
	return `Started sending out freespins for user: ${userId}`;
}

export function buildSendingOutFreeSpinsBatchToastSubTitle(
	totalUsers: number,
	totalBatches: number,
): string {
	return `Started sending out freespins in batches of 50. Total users: ${totalUsers}, total batches: ${totalBatches}`;
}

export function buildFreeSpinsBatchProcessedToastSubTitle(
	successUsers: number,
	totalBatches: number,
): string {
	return `Successfully processed ${totalBatches} batches. Success users: ${successUsers}`;
}

export function buildFreeSpinsBatchProcessedWithErrorsToastSubTitle(
	totalBatches: number,
	successUsers = 100,
): string {
	return `Processed ${successUsers} users. ${totalBatches} batches remaining.`;
}

export function buildFreeSpinsRewardNotificationSubTitle(
	freeSpinsAmount: number,
	freeSpinValue: number,
	expirationDate: string,
	gameName: string,
): string {
	return `You have redeemed ${freeSpinsAmount} Free Spins ($${freeSpinValue} each) for ${gameName}! This promo will expire at ${expirationDate} if you don't use it.`;
}

export function buildTransactionTypeAndValueNotFoundMessage(
	type: string,
	formattedValue: string,
): string {
	return `Transaction with type='${type}' and value='${formattedValue}' not found`;
}

export function buildFreeSpinsRevokeNotificationDescription(
	gameName: string,
	reason: string,
): string {
	return `The free spins promotion for ${gameName} game has been revoked. Note: ${reason}`;
}
