import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { isScheduledRun } from "configuration";
import { TestTag } from "@enums/test-tags";

test.describe("Recent Wins and Live Bets sections", () => {
	test.fixme(isScheduledRun);
	test.use(storageStateNewUserDB());
	test(
		"[ENG-4570] Verify the Total Bets in Recent Wins and Live Bets",
		testDetails()
			.withTags(JiraComponent.HOMEPAGE, TestTag.ACCEPTANCE)
			.withJiraBugTickets("7893")
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
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
