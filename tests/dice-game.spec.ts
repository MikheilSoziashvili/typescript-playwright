import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";
import { TestUserRole } from "@enums/test-user-roles";

test.describe("Dice tests", () => {
	const diceGameDomainData = testData().fromDomain().diceGame;
	test(
		"[ENG-299] Place a single bet on Dice and try to win",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.GAMDOM_ORIGINALS)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ browserSessionManager, diceGamePage }) => {
			await browserSessionManager.loginAs(TestUserRole.REGULAR, {
				reuseContext: true,
			});
			await diceGamePage.navigate();
			await diceGamePage
				.assertThat()
				.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

			const diceData = testData().fromPredefined().data.dice;
			const diceBetData = new DiceBetTestData({
				betAmount: diceData.betAmount,
				multiplier: diceData.multiplier,
			});

			await diceGamePage.fillInManualBetData(diceBetData.betAmount);

			await diceGamePage.steps().playUntilNumberOfWins(diceBetData, 1);

			await diceGamePage
				.assertThat()
				.diceMessageIs(DiceGameResultMessage.WIN);
		},
	);

	diceGameDomainData.diceMaxBetPotentialWinScenarios.forEach((scenario) => {
		test(
			`[ENG-3513] Dice - Check that max bet can be 1k and potential win 800k - Bet: ${scenario.betAmount}, Multiplier: ${scenario.multiplier}`,
			testDetails()
				.withJiraBugTickets("ENG-12158")
				.withTags(JiraComponent.DICE)
				.withAuthor(JiraUser.YUKSEL_CHAUSH)
				.apply(),
			async ({ browserSessionManager, diceGamePage, testDataObject }) => {
				test.fixme(scenario.skipScenario === true);

				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
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
