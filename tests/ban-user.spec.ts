import { test } from "@fixtures/fixtures";
import { getCookieHeader, getCurrentDate } from "@core/utils/utils";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import * as Configuration from "configuration";
import { BanReason } from "@enums/ban-reasons";
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
import { BooleanValueString } from "@enums/playwright/booleanValues";

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
	"Check that Support Requested and RG-banned Steam users can access the page",
	testDetails()
		.withTags(JiraComponent.ADMIN, JiraComponent.ADMIN_PANEL)
		.apply(),
	() => {
		test(
			"[ENG-11777] Check that Support Requested and RG-banned Steam users can access the page",
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

test.describe(
	"Hard Ban Tests",
	testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
	() => {
		test(
			"[ENG-11617] [Hard ban] 'Responsible gambling' ban for user with Unranked1 unclaimable reward",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ browserSessionManager, gamdomDb, testDataPredefined }) => {
				const banReason =
					testDataPredefined.data.responsibleGamblingBan.banReason;
				const adminUser = await browserSessionManager.loginAs(
					TestUserRole.ADMIN_USER_INFO_ADMIN,
					{ reuseContext: true },
				);

				const adminUserCookie = getCookieHeader(
					adminUser.getAuthenticatedUser().cookie,
				);
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{
						regularUserOptions: {
							emailVerified: true,
							startingXp:
								testDataPredefined.data.responsibleGamblingBan
									.unrankedXp,
							amount: testDataPredefined.data
								.responsibleGamblingBan.walletAmount,
						},
					},
				);

				const { username, password, userId } =
					regularUser.getAuthenticatedUser().user;

				await gamdomDb.insertRoyaltyUpReward(
					userId,
					testDataPredefined.data.responsibleGamblingBan.royaltyLevel,
				);

				await (
					await adminUser.apis.gamdomApi
				).banUser(userId, BanReason.RESPONSIBLE_GAMING, {
					Cookie: adminUserCookie,
				});

				await regularUser.pages.homePage.navigate();
				await regularUser.pages.homePage
					.steps()
					.loginUser(username, password, {
						expectErrors: true,
					});

				await regularUser.pages.bannedUserPage
					.steps()
					.verifyBannedPageWithReason(
						`${banReason} - ${getCurrentDate()}`,
					);
			},
		);

		testData()
			.fromCsvRaw({
				file: CsvFilesName.HARD_BAN_RESPONSIBLE_GAMBLING,
			})
			.forEach((input) => {
				test(
					`[ENG-10321] [Hard ban] 'Responsible gambling' ban - restricted access, claim rewards, withdraw balance, and account lock - ${input.twoFaLabel}`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async (
						{
							browserSessionManager,
							gamdomDb,
							gamdomApi,
							testDataPredefined,
							hardBanResponsibleGamblingTestFlow,
						},
						testInfo,
					) => {
						test.slow();

						await hardBanResponsibleGamblingTestFlow.execute({
							browserSessionManager: browserSessionManager,
							gamdomDb: gamdomDb,
							gamdomApi: gamdomApi,
							twoFaEnabled:
								input.twoFaEnabled === BooleanValueString.TRUE,
							testInfo: testInfo,
							testData:
								testDataPredefined.data
									.hardBanResponsibleGambling,
						});
					},
				);
			});

		test(
			"[ENG-10327] [Hard Ban] 'Support Requested' ban - verify restricted access for banned user",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({ hardBanSupportRequestedTestFlow }) => {
				await hardBanSupportRequestedTestFlow.execute();
			},
		);
	},
);
