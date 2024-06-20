import { generateRandomString } from "@core/utils";
import { RegisterTestData } from "@dtos/test-data";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});
let affiliateLink = "";

test.describe("Register with affiliate link", () => {
	test.slow();
	test.beforeEach(async ({ homePage, affiliatesPage, profilePage }) => {
		await homePage.navigateAndCheckTitle();
		await homePage.unauthenticatedHeader.openRegisterModal();

		const user_register_data = new RegisterTestData();
		await homePage.registerModal.fillInCredentials(user_register_data, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage
			.assertThat()
			.userIsRegistered(user_register_data.username);
		await affiliatesPage.navigate();

		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);
		affiliateLink = await affiliatesPage.getAffiliateLink();

		await profilePage.navigate();
		await profilePage.logout();
		await homePage.assertThat().userIsLoggedOut();
	});

	test("[ENG-1136] Register via affiliate link", async ({
		homePage,
		faqPage,
	}) => {
		await homePage.goToPage(affiliateLink);

		const affiliate_user_register_data = new RegisterTestData();
		await homePage.registerModal.fillInCredentials(
			affiliate_user_register_data,
			{
				acceptTermsOfService: true,
				acceptNewsOffers: true,
			},
		);
		await homePage.registerModal.clickStartPlayingBtn();
		await homePage
			.assertThat()
			.userIsRegistered(affiliate_user_register_data.username);

		await faqPage.navigate();
		await faqPage.expandAffiliateCodeRegisteredUnderSection();
		await faqPage
			.assertThat()
			.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
	});
});
