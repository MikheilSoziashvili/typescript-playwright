import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { jiraIssueId } from "@core/utils/utils";

test.describe("Recent Wins and Live Bets sections", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-4570] Verify the Total Bets in Recent Wins and Live Bets",
		{
			tag: ["@homepage"],
			annotation: {
				type: AnnotationType.BUG,
				description: jiraIssueId(7893),
			},
		},
		async ({ diceGamePage, homePage }) => {
			await diceGamePage.navigate();
			await diceGamePage
				.assertThat()
				.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

			const diceBetData = new DiceBetTestData({
				betAmount: 10,
				multiplier: 1.2,
			});

			await diceGamePage.fillInManualBetData(diceBetData.betAmount);
			await diceGamePage
				.assertThat()
				.manualBetAndProfitOnWinValuesAreCorrect(
					diceBetData.betAmount,
					diceBetData.betAmount,
				);

			await diceGamePage.steps().playUntilNumberOfWins(diceBetData, 15);

			await diceGamePage
				.assertThat()
				.diceMessageIs(DiceGameResultMessage.WIN);

			await homePage.clickGamdomLogo();

			await homePage
				.assertThat()
				.verifyRecentWinsSectionIsVisibleAndPopulated();

			await homePage
				.assertThat()
				.verifyTotalBetsAreNotZeroAndUpdatedInTime();

			await homePage.refresh();

			await homePage.assertThat().verifyRecentWinsDetailsAreNotVisible();

			await homePage
				.assertThat()
				.verifyTotalBetsAreNotZeroAndUpdatedInTime();
		},
	);
});
