import { test } from "@fixtures/fixtures";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { testDetails } from "@core/helpers/test-details-helper";
import { testData } from "test-data/test-data-manager";

const autobetRecords = testData().fromCsvParsed({
	file: CsvFilesName.DICE_AUTOBET,
});

const sokGamesDomain = testData().fromDomain().sokGames;
const scenarios = sokGamesDomain.autobetIncreaseByScenarios;

test.describe(
	"Dice game autobet",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.DICE)
		.apply(),
	() => {
		for (const record of autobetRecords) {
			test(
				`[ENG-1415] Dice - autobet with roll over ${record.rollOver}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({
					browserSessionManager,
					diceGamePage,
					testDataObject,
					userBalanceHandler,
				}) => {
					const betData =
						testDataObject.diceAutobet.fromCsvRecord(record);
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});

					await diceGamePage.steps().openDefaultGameState();

					const initialBalance =
						await userBalanceHandler.walletBalanceInFiatRounded();

					await diceGamePage.steps().startAutobet(betData);

					const finalBalance =
						await userBalanceHandler.walletBalanceInFiatRounded();

					await diceGamePage
						.assertThat()
						.balanceAfterAutoBetIsCorrect(
							initialBalance,
							finalBalance,
							betData,
						);
				},
			);
		}

		scenarios.forEach(({ betAmount, onWin, onLoss }) => {
			test(
				`[ENG-2843] Dice - Autobet - Increase By - Bet ${betAmount} - Win ${onWin}% Loss ${onLoss}%`,
				testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
				async ({ browserSessionManager, diceGamePage }) => {
					await browserSessionManager.loginAs(TestUserRole.REGULAR, {
						reuseContext: true,
					});
					await diceGamePage.steps().openDefaultGameState();
					await diceGamePage.configureAutobetIncreaseBy(
						betAmount,
						sokGamesDomain.autobetCount,
						onWin,
						onLoss,
					);
					await diceGamePage
						.steps()
						.playAutobetUntilWinAndLoss(betAmount, onWin, onLoss);
				},
			);
		});

		test(
			"[ENG-5847] Dice - Stop Autobet actuates immediately",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				browserSessionManager,
				diceGamePage,
				userBalanceHandler,
				testDataObject,
			}) => {
				const betData =
					testDataObject.diceAutobet.preconfigured().stopAutobet;

				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});
				await diceGamePage.steps().openDefaultGameState();

				const initialBalance =
					await userBalanceHandler.walletBalanceInFiatRounded();

				await diceGamePage.steps().startAndStopAutobetManually(betData);

				await diceGamePage.authenticatedHeader
					.assertThat()
					.accountBalanceHasChanged(initialBalance);
			},
		);
	},
);
