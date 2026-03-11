import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { CsvFilesName } from "@enums/csv-file-name";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { HIGH_USER_AMOUNT } from "database/constants/user-amounts";

const crashAutoCashout = testData().fromCsvParsed({
	file: CsvFilesName.CRASH_AUTO_CASHOUT,
});

test.describe(
	"Crash tests",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.CRASH)
		.apply(),
	() => {
		test.slow();

		test(
			"[ENG-265] Place a single bet on Crash and try to cashout",
			testDetails()
				.withTags(TestTag.SMOKE, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
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
				}).normalBetMinMultiplier;

				await crashGamePage.navigate();

				const { accountBalanceBeforePlay, totalBetsPlaced, winnings } =
					await crashGamePage
						.steps()
						.playUntilMultiplierIs(betTestData);

				await crashGamePage
					.assertThat()
					.balanceAfterWinIsCorrect(
						accountBalanceBeforePlay,
						totalBetsPlaced,
						winnings,
					);
			},
		);

		crashAutoCashout.forEach((record) => {
			test(
				`[ENG-1118] Crash - Auto Cashout with: [${record.yourBet}] value bets`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					browserSessionManager,
					crashGamePage,
					testDataObject,
				}) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
						regularUserOptions: { amount: HIGH_USER_AMOUNT },
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

					await crashGamePage.navigate();

					const {
						accountBalanceBeforePlay,
						totalBetsPlaced,
						winnings,
					} = await crashGamePage
						.steps()
						.playUntilMultiplierIs(betTestData);

					await crashGamePage
						.assertThat()
						.isExpectedAndActualWinningMatch(
							record.expectedResults,
							winnings,
						);

					await crashGamePage
						.assertThat()
						.balanceAfterWinIsCorrect(
							accountBalanceBeforePlay,
							totalBetsPlaced,
							winnings,
						);
				},
			);
		});
	},
);
