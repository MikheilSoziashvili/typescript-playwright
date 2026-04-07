import { test } from "@fixtures/fixtures";
import { ToastTitle } from "@enums/toast-titles";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { ToastSubTitle } from "@enums/toast-subtitles";

test.describe(
	"Register tests",
	testDetails().withTags(JiraComponent.LOGIN_REGISTER).apply(),
	() => {
		test.use({ storageState: { cookies: [], origins: [] } });

		test(
			`[ENG-7853] Verify correct display of "Create Account" modal window`,
			testDetails()
				.withTags(JiraComponent.ACCOUNT_CREATION, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ homePage }) => {
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openRegisterModal();
				await homePage.registerModal
					.assertThat()
					.registerFormWithRegisterElementsAreDisplayed();
			},
		);

		test(
			`[ENG-9512] Verify new account creation flow`,
			testDetails()
				.withTags(TestTag.SMOKE, JiraComponent.ACCOUNT_CREATION, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ homePage, toast, testDataObject }) => {
				const registerData = testDataObject.register.random();
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openRegisterModal();
				await homePage.registerModal
					.steps()
					.fillInCredentialsSuccessfully(registerData, {
						acceptTermsOfService: true,
					});
				await homePage.registerModal.clickStartPlayingBtn();

				await homePage.authenticatedHeader
					.assertThat()
					.userIsRegistered(registerData.username);

				await toast
					.assertThat()
					.toastMessageIs(
						ToastTitle.SUCCESS,
						ToastSubTitle.RESEND_EMAIL,
					);
			},
		);
	},
);
