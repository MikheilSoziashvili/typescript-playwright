import { generateRandomString } from "@core/utils";
import { RegisterTestData } from "@dtos/test-data";
import { NotificationTitle } from "@enums/notification-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";
const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Affiliates tests", () => {
	test.slow();
	test("[ENG-297] Create an affiliate code and use it with a new account @smoke", async ({
		homePage,
		affiliatesPage,
		profilePage,
		rewardsPage,
		faqPage,
		notifications,
		toast,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openRegisterModal();

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
		await homePage.unauthenticatedHeader.openRegisterModal();

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
			.titleIs(NotificationTitle.WELCOME_BONUS);
		await notifications.aknowledge({
			title: NotificationTitle.WELCOME_BONUS,
		});
		await notifications.assertThat().isNotDisplayed();

		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: ToastSubTitle.CLAIMED_BONUS,
		});
		await toast.assertThat().isNotDisplayed({
			subTitle: ToastSubTitle.CLAIMED_BONUS,
		});

		await faqPage.navigate();
		await faqPage.expandAffiliateCodeRegisteredUnderSection();
		await faqPage
			.assertThat()
			.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
	});
});
