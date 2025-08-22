import { testDetails } from "@core/helpers/test-details-helper";
import { generateRandomString } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});
let affiliateLink = "";

test.describe("Register with affiliate link", () => {
	test.use(storageStateNewUserDB());
	test.slow();

	test.beforeEach(async ({ affiliatesPage }) => {
		await affiliatesPage.navigate();
		await affiliatesPage.steps().addCode(AUTOMATION_AFFILIATES_CODE);
		affiliateLink = await affiliatesPage.getAffiliateLink();
	});

	test(
		"[ENG-1136] Register via affiliate link",
		testDetails().withJiraBugTickets("7309").apply(),
		async ({ homePage, faqPage }) => {
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
			await Promise.all([
				homePage.steps().verifyToastMessage(ToastTitle.SUCCESS),
				homePage.registerModal.clickStartPlayingBtn(),
			]);
			await homePage
				.assertThat()
				.userIsRegistered(affiliate_user_register_data.username);

			await faqPage.navigate();
			await faqPage.expandAffiliateCodeRegisteredUnderSection();
			await faqPage
				.assertThat()
				.isAffiliateCodeVisible(AUTOMATION_AFFILIATES_CODE);
		},
	);
});
