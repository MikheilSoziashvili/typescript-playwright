import { testDetails } from "@core/helpers/test-details-helper";
import { LimboBetTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"Limbo game tests",
	testDetails().withTags(JiraComponent.GAMDOM_ORIGINALS).apply(),
	() => {
		test.slow();
		testData()
			.fromCsvRaw({ file: CsvFilesName.LIMBO_MANUAL_MODE })
			.forEach((record) => {
				test(
					`[ENG-10738][Limbo] Manual mode - Bet: $${record.betAmount}, Multiplier: ${record.multiplier}x`,
					testDetails()
						.withTags(TestTag.ORIGINALS)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({ browserSessionManager }) => {
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{
								reuseContext: true,
							},
						);

						const limboBetData = new LimboBetTestData({
							betAmount: parseFloat(record.betAmount),
							multiplier: parseFloat(record.multiplier),
						});

						await regularUser.pages.limboGamePage
							.steps()
							.navigateAndAssertRollButton();

						await regularUser.pages.limboGamePage
							.steps()
							.playAndVerifyBalanceUpdates(limboBetData);
					},
				);
			});
	},
);

test.describe(
	"Limbo autobet tests",
	testDetails().withTags(JiraComponent.LIMBO).apply(),
	() => {
		test.slow();
		testData()
			.fromCsvRaw({ file: CsvFilesName.LIMBO_AUTO_MODE })
			.forEach((record) => {
				test(
					`[ENG-10737][Limbo] Auto mode - Bet: $${record.betAmount}, Multiplier: ${record.multiplier}x`,
					testDetails()
						.withTags(TestTag.ORIGINALS)
						.withAuthor(JiraUser.ANGEL_PETROV)
						.apply(),
					async ({ limboAutobetTestFlow, testDataPredefined }) => {
						const numberOfRounds =
							testDataPredefined.data.limboAutobet.numberOfRounds;

						const limboBetData = new LimboBetTestData({
							betAmount: parseFloat(record.betAmount),
							multiplier: parseFloat(record.multiplier),
						});

						await limboAutobetTestFlow.executeAutobetScenario({
							limboBetData,
							numberOfRounds,
						});
					},
				);
			});
	},
);
