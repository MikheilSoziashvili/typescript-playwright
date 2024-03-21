import { generateRandomString, hardWait } from "../core/utils";
import { RegisterTestData } from "../dtos/test-data";
import { NotificationsTitles } from "../enums/notifications-titles";
import { test } from "../fixtures/fixtures";
const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Affiliates tests", () => {
	test.slow();
	test("[QA-172] Create an affiliate code and use it with a new account @smoke", async ({
		homePage,
		affiliatesPage,
		profilePage,
		rewardsPage,
		faqPage,
		notifications,
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

		await homePage.refresh();
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

		await notifications.assertThat().isDisplayed();
		await notifications
			.assertThat()
			.titleIs(NotificationsTitles.WELCOME_BONUS);
		await notifications.aknowledge({
			title: NotificationsTitles.WELCOME_BONUS,
		});
		await notifications.assertThat().isNotDisplayed();
		//TODO: Add assertion for toast when components are implemented QT-334

		await faqPage.navigate();
		await faqPage.expandAffiliateCodeRegisteredUnderSection();
		await faqPage
			.assertThat()
			.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
	});
});
