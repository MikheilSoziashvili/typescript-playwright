import { generateRandomString, hardWait } from "../core/utils";
import { RegisterTestData } from "../dtos/test-data";
import { test } from "../fixtures/fixtures";
const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe.only("Affiliates tests", () => {
	test.slow();
	test("[QA-172] Create an affiliate code and use it with a new account @smoke", async ({
		homePage,
		affiliatesPage,
		profilePage,
		rewardsPage,
		faqPage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.openRegisterModal();

		const user_1_register_data = new RegisterTestData();
		await homePage.registerModal.fillInCredentials(user_1_register_data, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage
			.assertThat()
			.userIsRegistered(user_1_register_data.username);

		await affiliatesPage.navigate();
		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);

		await profilePage.navigate();
		await profilePage.logout();
		await homePage.assertThat().userIsLoggedOut();

		await homePage.navigate();
		await homePage.openRegisterModal();

		const user_2_register_data = new RegisterTestData();
		await homePage.registerModal.fillInCredentials(user_2_register_data, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage
			.assertThat()
			.userIsRegistered(user_2_register_data.username);

		await rewardsPage.navigate();
		await rewardsPage.steps().claimCode(AUTOMATION_AFFILIATES_CODE);

		//TODO: Add assertion for notification and for toast when components are implemented QT-334 and QT-335

		await faqPage.navigate();
		await faqPage.expandAffiliateCodeRegisteredUnderSection();
		await faqPage
			.assertThat()
			.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
	});
});
