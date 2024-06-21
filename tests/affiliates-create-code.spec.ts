import { buildCreateAffiliateCodeSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { generateRandomString } from "@core/utils";
import { RegisterTestData } from "@dtos/test-data";
import { ToastTitle } from "@enums/toast-titles";
import { test } from "@fixtures/fixtures";

const AUTOMATION_AFFILIATES_CODE = generateRandomString({
	prefix: "automation",
});

test.describe("Create affiliate code", () => {
	test.slow();
	test("[ENG-1135] Create an affiliate code", async ({
		homePage,
		affiliatesPage,
		toast,
	}) => {
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
		await toast.assertThat().titleIs(ToastTitle.SUCCESS, {
			subTitle: buildCreateAffiliateCodeSubTitle(
				AUTOMATION_AFFILIATES_CODE,
			),
		});
	});
});
