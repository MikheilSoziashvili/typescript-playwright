import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { test } from "@fixtures/fixtures";
import { getCurrentDate, setAuthenticationCookies } from "@core/utils/utils";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { JiraComponent } from "@enums/jira/jira-components";

test.describe(
	"Ban user",
	testDetails().withTags(JiraComponent.ADMIN).apply(),
	() => {
		const BAN_REASON = "automation test";

		test(
			"[ENG-288] Banning a user",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).apply(),
			async ({
				gamdomApiDbFacade,
				homePage,
				userInfoAdminPage,
				infoAdminPage,
				bannedUserPage,
				gamdomApi,
				page,
			}) => {
				const [userData] = await gamdomApiDbFacade.createUsersDb({
					usersCount: 1,
				});
				const cookie = await gamdomApi.authenticateWithExistingUser(
					SUPER_ADMIN_CREDENTIALS.username,
					SUPER_ADMIN_CREDENTIALS.password,
				);
				await setAuthenticationCookies(page, cookie);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(userData.username);

				await infoAdminPage.steps().banUser({ reason: BAN_REASON });

				await homePage.navigate({ cookies: { clearCookies: true } });
				await homePage
					.steps()
					.loginUser(userData.username, userData.password, {
						expectErrors: true,
					});

				await bannedUserPage.waitRedContainerToBeVisible();
				await bannedUserPage.assertThat().isBannedTitleDisplayed();
				await bannedUserPage
					.assertThat()
					.isBannedReasonDisplayed(
						`${BAN_REASON} - ${getCurrentDate()}`,
					);
			},
		);

		test.use(storageStateNewSuperAdminUserDB());
		test(
			"[ENG-6414] Category Ban - Verify casino and sportsbook ban options are displayed",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ gamdomApiDbFacade, userInfoAdminPage, infoAdminPage }) => {
				const { user } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(user.username);

				await infoAdminPage.steps().verifyBanUserCategoryOptions();
			},
		);
	},
);
