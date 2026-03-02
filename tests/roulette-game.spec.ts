import { RouletteNumberColor } from "@enums/original-games";
import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";

test.describe(
	"Roulette tests",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.ROULETTE)
		.apply(),
	() => {
		test.slow();
		test(
			"[ENG-264] Place a single bet on Roulette and try to win",
			testDetails()
				.withTags(TestTag.SMOKE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({
				browserSessionManager,
				rouletteGamePage,
				testDataObject,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});
				const testData = testDataObject.rouletteBet.default({
					username: browserSessionManager.activeUser.user.username,
				});
				const { accountBalance, rouletteResultNumber } =
					await rouletteGamePage
						.steps()
						.playUntilResultColorIs(
							RouletteNumberColor.BLACK,
							testData,
						);
				await rouletteGamePage
					.steps()
					.assertBalanceAfterWin(accountBalance, testData);
				await rouletteGamePage
					.assertThat()
					.previousRollsHistoryUpdated(rouletteResultNumber);
			},
		);

		test(
			"[ENG-5847] Roulette - Stop Autobet actuates immediately",
			testDetails()
				.withTags(
					JiraComponent.GAMDOM_ORIGINALS,
					JiraComponent.ROULETTE,
				)
				.apply(),
			async ({
				browserSessionManager,
				rouletteGamePage,
				testDataPredefined,
			}) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});
				const { betAmount, stopIfBalanceIsOver } =
					testDataPredefined.data.roulette.autobet;

				await rouletteGamePage.navigate();
				await rouletteGamePage.waitBettingWindowAvailable();
				await rouletteGamePage.insertBet(betAmount);

				await rouletteGamePage.expandAutobetSection();
				await rouletteGamePage
					.steps()
					.startAutobet(stopIfBalanceIsOver);
				await rouletteGamePage.steps().stopAutobet();
			},
		);
	},
);
