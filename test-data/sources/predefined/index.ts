import { DateOffset } from "@enums/datetime/date-offset";
import { Wallet } from "@enums/wallets";

export const predefined = {
	admin: {
		newUsersPage: {
			betweenUserIDsFilter: {
				startUserID: 350,
				endUserID: 450,
			},
		},
	},
	datetime: {
		dateOffset: DateOffset,
	},
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
		freeSpinsRevoke: {
			title: "Promotion",
		},
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
	dice: {
		betAmount: 1,
		multiplier: 1.5,
		defaultMultiplier: 2.0,
	},
	sokAutobet: {
		betAmount: 1,
		betAmountLow: 0.15,
		autobetCount: 1,
		onWinIncrease20: 20,
		onWinIncrease50: 50,
		onLossIncrease50: 50,
		onLossIncrease20: 20,
	},
	veriff: {
		documentTypes: ["document-front", "document-back", "face"],
		documentImage:
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	},
	usdtAmountToDeposit: {
		amountToDeposit: "0.02",
		amountToDepositLarger: "0.4",
		amountToWithdraw: 0.3,
		withdrawalAddress: "0x88190Ef584BD63E320693133f01c0cfcdA24bB8e",
	},
	xrpAmountToDeposit: {
		amountToDeposit: "0.05",
	},
	ltcAmountToDeposit: {
		amountToDeposit: 0.0004,
	},
	ethAmountToDeposit: {
		amountToDeposit: "0.0002",
		amountToWithdraw: 0.3,
		withdrawalAddress: "0x88190Ef584BD63E320693133f01c0cfcdA24bB8e",
	},
	solAmountToDeposit: {
		amountToDeposit: "0.002",
		amountToDepositLarger: "0.007",
		amountToWithdraw: 0.4,
		withdrawalAddress: "EHWKMqDvZ71AmpS4uLD5vAGwkeyFdPg8jh2bHk3YCKzi",
	},
	freeSpinsRewardConditions: {
		startDateOffset: 1,
		endDateOffset: 7,
	},
	trxAmountToDeposit: {
		amountToDeposit: "0.002",
		amountToDepositLarger: "0.007",
		amountToWithdraw: 0.3,
		withdrawalAddress: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
	},
	usdtTrxAmountToDeposit: {
		amountToDeposit: "0.02",
	},
	newProviderNames: {
		hacksawHub: "Hacksaw Gaming hub",
		pragmaticPlayAlea: "Pragmatic Play alea",
	},
	usdcEthAmountToDeposit: {
		amountToDeposit: "0.02",
	},
	usdcSolAmountToDeposit: {
		amountToDeposit: "0.02",
	},
	dogeAmountToDeposit: {
		amountToDeposit: "0.10",
	},
};
