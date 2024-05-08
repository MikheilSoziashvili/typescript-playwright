import { test as setup } from "@fixtures/fixtures";
import { HomePage } from "@pages/home-page/home-page";
import {
	SUPER_ADMIN_CREDENTIALS,
	USER_1_CREDENTIALS,
} from "@constants/credentials";
import {
	SUPER_ADMIN_AUTH_STATE_FILE_PATH,
	USER_1_AUTH_STATE_FILE_PATH,
} from "@constants/file-paths";

// Setup left for backward compatability. Might be removed later.
setup("[QA-193] Authenticate as admin", async ({ page }) => {
	const homePage: HomePage = new HomePage(page);
	await homePage.navigate();

	await homePage.unauthenticatedHeader.openLoginModal();
	await homePage.loginModal.login(
		SUPER_ADMIN_CREDENTIALS.username,
		SUPER_ADMIN_CREDENTIALS.password,
	);
	await homePage.assertThat().userIsLoggedIn();

	await page
		.context()
		.storageState({ path: SUPER_ADMIN_AUTH_STATE_FILE_PATH });
});

setup("[QA-194] Authenticate as user_1", async ({ page }) => {
	const homePage: HomePage = new HomePage(page);
	await homePage.navigate();

	await homePage.unauthenticatedHeader.openLoginModal();
	await homePage.loginModal.login(
		USER_1_CREDENTIALS.username,
		USER_1_CREDENTIALS.password,
	);
	await homePage.assertThat().userIsLoggedIn();

	await page.context().storageState({ path: USER_1_AUTH_STATE_FILE_PATH });
});
