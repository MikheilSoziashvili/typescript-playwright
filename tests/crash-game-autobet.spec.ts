import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { CsvFilesName } from "@enums/csv-file-name";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";

const crashIncreaseBy = testData().fromCsvParsed({
	file: CsvFilesName.CRASH_INCREASE_BY,
});

test.describe(
	"Crash autobet tests",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.CRASH)
		.apply(),
	() => {
		test.slow();

		test(
			"[ENG-13776] Crash - Autobet",
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				crashGamePage,
				testDataObject,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				const betTestData = testDataObject.bet.preconfigured({
					username: browserSessionManager.activeUser.user.username,
				}).normalBetMediumMultiplier;

				await crashGamePage.toggleAutobet(betTestData.stopBetAmount);

				const { accountBalanceBeforePlay, totalBetsPlaced, winnings } =
					await crashGamePage
						.steps()
						.playUntilMultiplierIs(betTestData, {
							autobet: true,
						});

				await crashGamePage
					.assertThat()
					.balanceAfterWinIsCorrect(
						accountBalanceBeforePlay,
						totalBetsPlaced,
						winnings,
					);
			},
		);

		test(
			"[ENG-2663] Crash - Start Autobet button is active",
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				crashGamePage,
				testDataObject,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				const betTestData = testDataObject.bet.preconfigured({
					username: browserSessionManager.activeUser.user.username,
				}).normalBetMediumMultiplier;

				await crashGamePage
					.steps()
					.enableAutobetAndFillAmount(betTestData.betAmount);
			},
		);

		test(
			"[ENG-5847] Crash - Stop Autobet actuates immediately",
			testDetails()
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.withTags(TestTag.ACCEPTANCE)
				.apply(),
			async ({
				browserSessionManager,
				crashGamePage,
				testDataObject,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				const betTestData = testDataObject.bet.preconfigured({
					username: browserSessionManager.activeUser.user.username,
				}).normalBetMediumMultiplier;

				await crashGamePage.steps().startAutobet(betTestData.betAmount);
				await crashGamePage.steps().stopAutobet();
			},
		);

		crashIncreaseBy.forEach((record) => {
			test(
				`[ENG-13776] Crash - Autobet - Increase by [${record.increaseBy}]`,
				testDetails()
					.withAuthor(JiraUser.NIKOLAY_GENOV)
					.withTags(TestTag.ACCEPTANCE)
					.apply(),
				async ({
					browserSessionManager,
					crashGamePage,
					testDataObject,
				}) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});

					const betTestData = testDataObject.bet.build(
						{
							username:
								browserSessionManager.activeUser.user.username,
						},
						{
							betAmount: record.yourBet,
							autoCashoutMultiplier: record.autoCashout,
						},
					);

					await crashGamePage
						.steps()
						.setupAutobetWithIncreaseBy(
							betTestData,
							record.stopIfMoreThan,
							record.increaseBy,
							record.increaseMultiplier,
						);

					await crashGamePage
						.steps()
						.autobetUntilBetMoreThan(
							betTestData,
							record.stopIfMoreThan,
							record.increaseMultiplier,
							record.increaseBy,
						);
				},
			);
		});
	},
);
