import { test } from "@fixtures/fixtures";
import { RegisterTestData } from "@dtos/test-data";
import { ToastTitle } from "@enums/toast-titles";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";

test.describe("Register tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test(
		"[ENG-296] Register with email",
		testDetails()
			.withTags(TestTag.SMOKE)
			.withTags(JiraComponent.ACCOUNT_CREATION)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
		async ({ homePage }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.unauthenticatedHeader.openRegisterModal();

			const registeredData = new RegisterTestData();
			await homePage.registerModal.fillInCredentials(registeredData, {
				acceptTermsOfService: true,
				acceptNewsOffers: true,
			});

			await homePage.registerModal.clickStartPlayingBtn();
			await homePage.steps().verifyToastMessage(ToastTitle.SUCCESS);

			await homePage
				.assertThat()
				.userIsRegistered(registeredData.username);
		},
	);
});
