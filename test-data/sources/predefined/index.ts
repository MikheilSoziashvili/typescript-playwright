import { Wallet } from "@enums/wallets";

export const predefined = {
	wallets: {
		walletType: Wallet.USD,
	},
	transactions: {
		depositAmount: 3000,
	},
	notifications: {
		title: "testNotificationTitle",
		description: "testNotificationDescription",
		reason: "testNotificationReason",
	},
	betsNumberPlinkoCannon: {
		numberOfBets: "500",
	},
	vault: {
		amountToWithdraw: 5,
	},
	bets: {
		betAmountDDefault: 1,
		betAmountSmall: 10,
	},
	usdtAmountToDeposit: {
		amountToDeposit: "0.02"
	}
};
