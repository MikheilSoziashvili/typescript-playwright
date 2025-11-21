import { testData } from "test-data/test-data-manager";

export const predefinedDataScenarios = {
	notificationsTests: testData()
		.fromPredefined()
		.withOverrides(
			[
				(data) => data.notifications.title,
				(data) => data.notifications.description,
				(data) => data.notifications.reason,
			],
			["testTitle", "testDescription", "testReason"],
		)
		.pick({
			title: (data) => data.notifications.title,
			description: (data) => data.notifications.description,
			reason: (data) => data.notifications.reason,
		}),
	sokGamesAutobetIncreaseBy: testData()
		.fromPredefined()
		.pick({
			betAmount: (data) => data.sokAutobet.betAmount,
			betAmountLow: (data) => data.sokAutobet.betAmountLow,
			autobetCount: (data) => data.sokAutobet.autobetCount,
			onWinIncrease20: (data) => data.sokAutobet.onWinIncrease20,
			onWinIncrease50: (data) => data.sokAutobet.onWinIncrease50,
			onLossIncrease20: (data) => data.sokAutobet.onLossIncrease20,
			onLossIncrease50: (data) => data.sokAutobet.onLossIncrease50,
		}),
};
