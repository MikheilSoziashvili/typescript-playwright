import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";
import { setAuthenticationCookies } from "@core/utils/utils";

test.describe("Ban user", () => {
	const NEW_USER_REGISTER_DATA = new RegisterTestData();
	const BAN_REASON = "automation test";

	test.beforeEach(async ({ homePage, profilePage }) => {
		await homePage.navigateAndCheckTitle();
		await homePage.steps().registerNewUser(NEW_USER_REGISTER_DATA);
		await profilePage.navigate();
		await profilePage.logout();
	});

	test.slow();
	test("[ENG-288] Banning a user", async ({
		homePage,
		userInfoAdminPage,
		infoAdminPage,
		bannedUserPage,
		gamdomApi,
		page,
	}) => {
		const cookie = await gamdomApi.authenticateWithExistingUser(
			SUPER_ADMIN_CREDENTIALS.username,
			SUPER_ADMIN_CREDENTIALS.password,
		);
		await setAuthenticationCookies(page, cookie);

		await userInfoAdminPage.navigate();
		await userInfoAdminPage
			.steps()
			.showUserDetails(NEW_USER_REGISTER_DATA.username);

		await infoAdminPage.steps().banUser({ reason: BAN_REASON });

		await homePage.navigate({ cookies: { clearCookies: true } });
		await homePage
			.steps()
			.loginUser(
				NEW_USER_REGISTER_DATA.username,
				NEW_USER_REGISTER_DATA.password,
				{ expectErrors: true },
			);

		await bannedUserPage.waitRedContainerToBeVisible();
		await bannedUserPage.assertThat().isBannedTitleDisplayed();
		await bannedUserPage.assertThat().isBannedReasonDisplayed(BAN_REASON);
	});
});
