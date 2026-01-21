import { testDetails } from "@core/helpers/test-details-helper";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
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
	testDetails().withTags(TestTag.SEQUENTIAL, JiraComponent.PROFILE).apply(),
	() => {
		test.fixme(isScheduledRun);
		test(
			"[ENG-4419] Hidden details in Live Bets and Recent Wins - ON",
			testDetails()
				.withJiraBugTickets("7893")
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ browserSessionManager, testDataObject }) => {
				const regular = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);

				await regular.pages.profilePage.navigate();
				await regular.pages.profilePage.steps().enableHiddenDetails();

				await regular.pages.diceGamePage.navigate();
				await regular.pages.diceGamePage
					.assertThat()
					.diceMessageIs(DiceGameResultMessage.PLACE_YOUR_BETS);

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

				await regular.pages.diceGamePage
					.assertThat()
					.diceMessageIs(DiceGameResultMessage.WIN);

				await regular.pages.homePage.clickGamdomLogo();

				await regular.pages.homePage
					.assertThat()
					.verifyHomepageStatisticsAreCorrect();

				await regular.pages.homePage
					.assertThat()
					.usernameIsMaskedInSections(
						HomePageSection.RECENT_WINS,
						HomePageSection.LIVE_BETS,
					);
			},
		);
	},
);

test.describe(
	"User details tests - v4",
	testDetails()
		.withTags(
			TestTag.V4,
			TestTag.SEQUENTIAL,
			JiraComponent.PROFILE,
			JiraComponent.PRIVACY,
		)
		.apply(),
	() => {
		test.fixme(isScheduledRun);
		test(
			"[ENG-13715] Hidden details in Live Bets - ON - v4",
			testDetails()
				.withJiraBugTickets("7893")
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ browserSessionManager, testDataObject }) => {
				const regular = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);

				await regular.pages.privacyPage.navigate();
				await regular.pages.privacyPage.steps().enableHiddenDetailsV4();

				await regular.pages.diceGamePage.navigate();

				const betTestData = testDataObject.bet.preconfigured({
					username: regular.getAuthenticatedUser().user.username,
				}).highBetMinMultiplier;

				await regular.pages.diceGamePage.steps().placeWinningBetV4(
					{
						betAmount: betTestData.betAmount,
						multiplier: betTestData.autoCashoutMultiplier,
					},
					ExpectedWins.TEN,
				);

				await regular.pages.homePage.clickGamdomLogoV4();

				await regular.pages.homePage
					.assertThat()
					.verifyTotalBetsAreNotZeroAndUpdatedInTimeV4();

				await regular.pages.homePage
					.assertThat()
					.usernameIsMaskedInSectionV4(
						HomePageSection.LIVE_BETS,
					);
			},
		);
	},
);
