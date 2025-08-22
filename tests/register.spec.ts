import { test } from "@fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";
import { ToastTitle } from "@enums/toast-titles";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";

test.describe("Register tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test(
		"[ENG-296] Register with email",
		testDetails()
			.withTags(TestTag.SMOKE)
			.withJiraBugTickets("7309")
			.apply(),
		async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.unauthenticatedHeader.openRegisterModal();

			const registeredData = new RegisterTestData();
			await homePage.registerModal.fillInCredentials(registeredData, {
				acceptTermsOfService: true,
				acceptNewsOffers: true,
			});
			await Promise.all([
				homePage.steps().verifyToastMessage(ToastTitle.SUCCESS),
				homePage.registerModal.clickStartPlayingBtn(),
			]);
			await homePage
				.assertThat()
				.userIsRegistered(registeredData.username);
		},
	);
});
