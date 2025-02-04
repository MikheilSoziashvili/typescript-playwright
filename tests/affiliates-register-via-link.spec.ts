import { generateRandomString } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { storageStateNewUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});
let affiliateLink = "";

test.describe("Register with affiliate link", () => {
	test.use(storageStateNewUserAPI());
	test.slow();

	test.beforeEach(async ({ affiliatesPage }) => {
		await affiliatesPage.navigate();
		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);
		affiliateLink = await affiliatesPage.getAffiliateLink();
	});

	test("[ENG-1136] Register via affiliate link", async ({
		homePage,
		faqPage,
	}) => {
		test.fixme(
			true,
			`Issue [ENG-4743] "Success" toast message is not showing up after a new user is registered`,
		);
		await homePage.navigate({
			link: affiliateLink,
			cookies: { clearCookies: true },
		});

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
