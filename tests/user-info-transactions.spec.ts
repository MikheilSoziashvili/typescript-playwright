import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info - Transactions tab",
	testDetails()
		.withTags(JiraComponent.ADMIN, JiraComponent.TRANSACTIONS)
		.apply(),
	() => {
		test(
			`[ENG-7572]  Verify calculation and display of winnings and profit in transactions table`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApiDbFacade,
				page,
				homePage,
				plinkoGamePage,
				userInfoAdminPage,
				transactionsAdminPage,
			}) => {
				const betAmount = 10;
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);

				await plinkoGamePage.navigateAndWaitForGameToLoad();
				const { winnings, profit } = await plinkoGamePage
					.steps()
					.placeBetAndCalculateProfit(betAmount);

				await homePage.navigate({ cookies: { clearCookies: true } });

				const { cookie: superAdminCookie } =
					await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
				await setAuthenticationCookies(page, superAdminCookie);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(user.username);

				await userInfoAdminPage.clickUserInfoTab(
					UserInfoTabs.Transactions,
				);
				await transactionsAdminPage
					.steps()
					.fetchStatsCalculationsData();

				await transactionsAdminPage
					.assertThat()
					.totalWinningsStatsAreCorrect(winnings);
				await transactionsAdminPage
					.assertThat()
					.totalProfitStatsAreCorrect(profit);
			},
		);
	},
);
