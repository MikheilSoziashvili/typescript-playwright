import { test } from "@fixtures/fixtures";
import { getCurrentDate } from "@core/utils/utils";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import * as Configuration from "configuration";
import { BanReason } from "@enums/ban-reasons";

test.describe(
	"Ban user",
	testDetails().withTags(JiraComponent.ADMIN).apply(),
	() => {
		test(
			"[ENG-288] Banning a user",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ browserSessionManager, testDataPredefined }) => {
				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);
				const regularUserSession = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
				);

				const targetUser =
					regularUserSession.getAuthenticatedUser().user;

				await adminSession.pages.userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(targetUser.username);

				const banReason =
					testDataPredefined.data.admin.ban.defaultReason;

				await adminSession.pages.infoAdminPage
					.steps()
					.banUser({ reason: banReason });

				await regularUserSession.pages.homePage.navigate();
				await regularUserSession.pages.homePage
					.steps()
					.loginUser(targetUser.username, targetUser.password, {
						expectErrors: true,
					});

				await regularUserSession.pages.bannedUserPage.waitRedContainerToBeVisible();
				await regularUserSession.pages.bannedUserPage
					.assertThat()
					.isBannedTitleDisplayed();
				await regularUserSession.pages.bannedUserPage
					.assertThat()
					.isBannedReasonDisplayed(
						`${banReason} - ${getCurrentDate()}`,
					);
			},
		);

		test(
			"[ENG-6414] Category Ban - Verify casino and sportsbook ban options are displayed",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ browserSessionManager, gamdomApiDbFacade }) => {
				test.fixme(
					true,
					"The logic needs to be modified based on the updated test case",
				);
				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);

				const { user: targetUser } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();

				await adminSession.pages.userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(targetUser.username);

				await adminSession.pages.infoAdminPage
					.steps()
					.verifyBanUserCategoryOptions();
			},
		);

		test(
			"[ENG-6418] Ban User Modal - Verify ban types, ban reasons, and custom input field",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ browserSessionManager, gamdomApiDbFacade }) => {
				const adminSession = await browserSessionManager.loginAs(
					TestUserRole.SUPERADMIN,
					{ reuseContext: true },
				);

				const { user: targetUser } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();

				await adminSession.pages.userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(targetUser.username);

				await adminSession.pages.infoAdminPage
					.steps()
					.verifyBanUserModalDropdowns();
			},
		);
	},
);

test.describe(
	"[Admin][Ban] Check that Support Requested and RG-banned Steam users can access the page",
	testDetails()
		.withTags(JiraComponent.ADMIN, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			"[ENG-15707] Check that Support Requested and RG-banned Steam users can access the page",
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({
				homePage,
				steamAuthPage,
				steamBlockedPage,
				gamdomApi,
				gamdomDb,
				profilePage,
				browserSessionManager,
				steamUserLoginLogoutFlow,
				banUserVerificationFlow,
			}) => {
				const bannedUsername = Configuration.steam.bannedUsername;
				const usernameSteam = Configuration.steam.bannedUser;

				await steamUserLoginLogoutFlow.loginAndLogout({
					gamdomDb: gamdomDb,
					homePage: homePage,
					steamAuthPage: steamAuthPage,
					steamBlockedPage: steamBlockedPage,
					profilePage: profilePage,
					usernameSteam: usernameSteam,
					bannedUsername: bannedUsername,
					password: Configuration.steam.password,
				});

				await banUserVerificationFlow.banUserAndVerifyBanner({
					gamdomDb: gamdomDb,
					browserSessionManager: browserSessionManager,
					gamdomApi: gamdomApi,
					homePage: homePage,
					steamBlockedPage: steamBlockedPage,
					usernameSteam: usernameSteam,
					banReason: BanReason.SUPPORT_REQUESTED,
				});
			},
		);
	},
);
