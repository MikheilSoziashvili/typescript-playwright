import { test } from "@fixtures/fixtures";
import { DiceBetTestData } from "@dtos/test-data";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { isScheduledRun } from "configuration";
import { TestTag } from "@enums/test-tags";

test.describe("Live Bets section", () => {
	test.fixme(isScheduledRun);
	test.use(storageStateNewUserDB());
	test(
		"[ENG-4570] Verify the Total Bets in Live Bets",
		testDetails()
			.withTags(JiraComponent.HOMEPAGE, TestTag.ACCEPTANCE)
			.withJiraBugTickets("7893")
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ diceGamePage, homePage }) => {
			await diceGamePage.navigate();

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

			await homePage.clickGamdomLogo();

			await homePage
				.assertThat()
				.verifyTotalBetsAreNotZeroAndUpdatedInTime();

			await homePage.refresh();

			await homePage
				.assertThat()
				.verifyTotalBetsAreNotZeroAndUpdatedInTime();
		},
	);
});
