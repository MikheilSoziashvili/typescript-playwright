import { BrowserContext } from "@playwright/test";
import { superAdminStorageState } from "../configuration";
import { HomePage } from "../pages/home-page/home-page";

export type LoginFixtures = {
	superAdminLogin: undefined;
};

export const superAdminLogin = async (
	homePage: HomePage,
	context: BrowserContext,
): Promise<void> => {
	await homePage.navigate();
	// Applicable only for coder environment
	await homePage.loginToGoogle("gamdomUsername", "gamdomPassword");

	await homePage
		.assertThat()
		.titleHasText("Gamdom - Top Bitcoin & Crypto Casino!");

	await homePage.openLoginModal();
	await homePage.loginModal.login("superadmin", "password");
	await homePage.assertThat().userIsLoggedIn();

	await context.storageState({ path: superAdminStorageState });
};
