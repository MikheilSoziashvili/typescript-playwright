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
};
