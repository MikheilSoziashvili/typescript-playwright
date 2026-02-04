import { testDetails } from "@core/helpers/test-details-helper";
import { HomePageSection } from "@enums/homepage-launch-locations";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ExpectedWins } from "@enums/original-games";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";

test.describe(
	"User details tests",
	testDetails()
		.withTags(
			TestTag.SEQUENTIAL,
			JiraComponent.PROFILE,
			JiraComponent.PRIVACY,
		)
		.apply(),
	() => {
		test.fixme(isScheduledRun);
		test(
			"[ENG-13715] Hidden details in Live Bets - ON",
			testDetails()
				.withJiraBugTickets("7893")
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(TestTag.ACCEPTANCE).apply(),
			async ({ browserSessionManager, testDataObject }) => {
				const regular = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);

				await regular.pages.privacyPage.navigate();
				await regular.pages.privacyPage.steps().enableHiddenDetails();

				await regular.pages.diceGamePage.navigate();

				const betTestData = testDataObject.bet.preconfigured({
					username: regular.getAuthenticatedUser().user.username,
				}).highBetMinMultiplier;

				await regular.pages.diceGamePage.steps().placeWinningBet(
					{
						betAmount: betTestData.betAmount,
						multiplier: betTestData.autoCashoutMultiplier,
					},
					ExpectedWins.TEN,
				);

				await regular.pages.homePage.clickGamdomLogo();

				await regular.pages.homePage
					.assertThat()
					.verifyTotalBetsAreNotZeroAndUpdatedInTime();

				await regular.pages.homePage
					.assertThat()
					.usernameIsMaskedInSection(HomePageSection.LIVE_BETS);
			},
		);
	},
);
