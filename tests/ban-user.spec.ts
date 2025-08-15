import { SUPER_ADMIN_CREDENTIALS } from "@constants/credentials";
import { test } from "@fixtures/fixtures";
import { getCurrentDate, setAuthenticationCookies } from "@core/utils/utils";

test.describe("Ban user", () => {
	const BAN_REASON = "automation test";

	test.slow();
	test("[ENG-288] Banning a user", async ({
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

		await userInfoAdminPage.navigate();
		await userInfoAdminPage.steps().showUserDetails(userData.username);

		await infoAdminPage.steps().banUser({ reason: BAN_REASON });

		await homePage.navigate({ cookies: { clearCookies: true } });
		await homePage.steps().loginUser(userData.username, userData.password, {
			expectErrors: true,
		});

		await bannedUserPage.waitRedContainerToBeVisible();
		await bannedUserPage.assertThat().isBannedTitleDisplayed();
		await bannedUserPage
			.assertThat()
			.isBannedReasonDisplayed(`${BAN_REASON} - ${getCurrentDate()}`);
	});
});
