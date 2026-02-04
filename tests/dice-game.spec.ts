import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { TestUserRole } from "@enums/test-user-roles";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { isScheduledRun } from "configuration";

test.describe("Dice tests", () => {
	const diceGameDomainData = testData().fromDomain().diceGame;
	test(
		"[ENG-13728] Place a single bet on Dice and try to win",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.GAMDOM_ORIGINALS, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.withJiraBugTickets("ENG-13879")
			.apply(),
		async ({ browserSessionManager, diceGamePage, testDataObject }) => {
			await browserSessionManager.loginAs(TestUserRole.REGULAR, {
				reuseContext: true,
			});
			await diceGamePage.steps().openDefaultGameState();

			const diceData = testData().fromPredefined().data.dice;
			const diceBetData = testDataObject.diceBet.build({
				betAmount: diceData.betAmount,
				multiplier: diceData.multiplier,
			});

			await diceGamePage.fillInManualBetData(diceBetData.betAmount);

			const winResult = await diceGamePage
				.steps()
				.playUntilNumberOfWins(diceBetData, 1);

			await diceGamePage.steps().fairnessTableContainsWinValue(winResult);
		},
	);

	diceGameDomainData.diceMaxBetPotentialWinScenarios.forEach((scenario) => {
		test(
			`[ENG-3513] Dice - Check that max bet can be $500k and potential win $1.5m - Bet: ${scenario.betAmount}, Multiplier: ${scenario.multiplier}`,
			testDetails()
				.withJiraBugTickets("ENG-17661")
				.withTags(JiraComponent.DICE, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ browserSessionManager, diceGamePage, testDataObject }) => {
				test.fixme(isScheduledRun);

				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
					regularUserOptions: { amount: SUPER_HIGH_USER_AMOUNT },
				});
				await diceGamePage.navigate();
				await diceGamePage
					.assertThat()
					.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

				const diceBetData = testDataObject.diceBet.build({
					betAmount: scenario.betAmount,
					multiplier: scenario.multiplier,
				});

				await diceGamePage.placeBet(
					diceBetData.betAmount,
					diceBetData.multiplier,
				);

				await scenario.assertDiceRollResult(diceGamePage);
			},
		);
	});
});
