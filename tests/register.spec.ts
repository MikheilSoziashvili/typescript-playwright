import { test } from "fixtures/fixtures";
import { RegisterTestData } from "dtos/test-data";

test.describe("Register tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });
	test("[ENG-296] Register with email @smoke", async ({ homePage }) => {
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openRegisterModal();

		const registeredData = new RegisterTestData();
		await homePage.registerModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage.assertThat().userIsRegistered(registeredData.username);
	});
});
