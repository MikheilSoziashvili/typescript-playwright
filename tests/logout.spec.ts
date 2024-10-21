import { test } from "@fixtures/fixtures";
import { storageStateNewUserAPI } from "../fixtures/auth-fixtures";

test.describe("Logout tests", () => {
	test.use(storageStateNewUserAPI());
	test("[ENG-1541] Profile - logout @smoke", async ({
		profilePage,
		homePage,
	}) => {
		await profilePage.navigate();
		await profilePage.steps().cancelLogout();
		await profilePage.continueModal.assertThat().isNotDisplayed();
		await homePage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreVisible();

		await profilePage.logout();
		await profilePage.continueModal.assertThat().isNotDisplayed();
		await homePage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	});
});
