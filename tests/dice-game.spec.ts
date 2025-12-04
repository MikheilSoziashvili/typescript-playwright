import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { testData } from "test-data/test-data-manager";

test.describe("Dice tests", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-299] Place a single bet on Dice and try to win",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.GAMDOM_ORIGINALS)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ diceGamePage }) => {
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
});
