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
		ban: {
			defaultReason: "automation test",
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
		// prettier-ignore
		defaultRollover: 50.500000, //default rollover is dependant of default multiplier
		// prettier-ignore
		defaultWinChance: 49.50, //default win chance is dependant of default multiplier
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
		customLowFee: 0.1,
		customMidFee: 0.3,
		customHighFee: 0.5,
		withdrawalAddress: "0x88190Ef584BD63E320693133f01c0cfcdA24bB8e",
	},
	xrpAmountToDeposit: {
		amountToDeposit: "0.1",
		amountToWithdraw: 0.1,
		withdrawalAddress: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
	},
	ltcAmountToDeposit: {
		amountToDeposit: 0.0004,
		withdrawalAddress: "tltc1qjl0npgpydwmw3hux7q2ks24rrnqwnkvrhvyktx",
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
		amountToDepositLarger: "10",
		amountToWithdraw: 9,
		withdrawalAddress: "TGffk8beDx7NWo3Gcing54piQhMtUt3Hbq",
	},
	newProviderNames: {
		hacksawHub: "Hacksaw Gaming hub",
		pragmaticPlayAlea: "Pragmatic Play alea",
	},
	usdcEthAmountToDeposit: {
		amountToDeposit: "0.02",
		amountToDepositLarger: "0.7",
		amountToWithdraw: 0.3,
		withdrawalAddress: "0xE8047993dfddd6579f56206d03c444add030e800",
	},
	usdcSolAmountToDeposit: {
		amountToDeposit: "0.02",
		amountToDepositLarger: "0.07",
		amountToWithdraw: 0.4,
		customLowFee: 0.1,
		customMidFee: 0.3,
		customHighFee: 0.5,
		withdrawalAddress: "HswznJARBiyV3YKQSEGm1g7nidBtwYnMxbaMtF8cDSv",
	},
	dogeAmountToDeposit: {
		amountToDeposit: "0.10",
	},
	btcAmountToDeposit: {
		amountToDeposit: 0.00005,
		amountToDepositLarger: 0.0001,
		amountToWithdraw: 1.5,
		feeRate: 50,
	},
	amountTolerance: {
		amountToleranceUsd: 0.1,
	},
	usd1SolAmountToDeposit: {
		amountToDeposit: "0.1",
		amountToDepositLarger: "0.4",
		withdrawalAddress: "HswznJARBiyV3YKQSEGm1g7nidBtwYnMxbaMtF8cDSv",
	},
	xpChallenge: {
		evRequired: 1000,
		challengeDuration: 10,
		rewardAmount: 100,
		betAmount: 2000,
	},
	reloadReward: {
		days: 7,
		dailyReward: 1,
		totalReward: 7,
		amount: "$1.00",
		totalAmount: "$7.00",
		newTotalReward: 10,
		newTotalAmount: "$10.00",
	},
	usdtBscAmountToDeposit: {
		amountToDeposit: "0.1",
		amountToDepositLarger: "0.4",
		withdrawalAddress: "0xE8047993dfddd6579f56206d03c444add030e800",
	},
	bnbAmountToDeposit: {
		amountToDeposit: "0.0001",
		withdrawalAddress: "0xE8047993dfddd6579f56206d03c444add030e800",
	},
	usdcBscAmountToDeposit: {
		amountToDeposit: "0.1",
		amountToDepositLarger: "0.4",
		withdrawalAddress: "0xE8047993dfddd6579f56206d03c444add030e800",
	},
	usd1EthAmountToDeposit: {
		amountToDeposit: "0.1",
		amountToDepositLarger: "0.3",
		withdrawalAddress: "0xE8047993dfddd6579f56206d03c444add030e800",
	},
};
