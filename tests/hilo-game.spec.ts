import { HiloGameResultColor } from "@enums/hilo-result-messages";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";

test.describe(
	"Hilo tests",
	testDetails()
		.withTags(JiraComponent.GAMDOM_ORIGINALS, JiraComponent.HILO)
		.apply(),
	() => {
		test.slow();

		test(
			"[ENG-13583] Place a single bet on Hilo and try to win",
			testDetails()
				.withTags(TestTag.SMOKE, TestTag.ORIGINALS, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ browserSessionManager, hiloGamePage, testDataObject }) => {
				await browserSessionManager.loginAs(TestUserRole.REGULAR, {
					reuseContext: true,
				});

				const testData = testDataObject.hiloBet.default({
					username: browserSessionManager.activeUser.user.username,
				});

				const balanceBeforeWinningBet = await hiloGamePage
					.steps()
					.playUntilResultColorIs(HiloGameResultColor.RED, testData);

				await hiloGamePage
					.steps()
					.assertBalanceAfterWin(balanceBeforeWinningBet, testData);
			},
		);
	},
);
