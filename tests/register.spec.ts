import { test } from "@fixtures/fixtures";
import { ToastTitle } from "@enums/toast-titles";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { ToastSubTitle } from "@enums/toast-subtitles";

test.describe("Register tests", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test(
		"[ENG-296] Register with email",
		testDetails()
			.withTags(TestTag.SMOKE, TestTag.ACCEPTANCE)
			.withTags(JiraComponent.ACCOUNT_CREATION)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
		async ({ homePage, testDataObject }) => {
			await homePage.navigateAndCheckTitle();
			await homePage.unauthenticatedHeader.openRegisterModal();

			const registeredData = testDataObject.register.random();
			await homePage.registerModal.fillInCredentials(registeredData, {
				acceptTermsOfService: true,
			});

			await homePage.registerModal.clickStartPlayingBtn();
			await homePage.steps().verifyToastMessage(ToastTitle.SUCCESS);

			await homePage
				.assertThat()
				.userIsRegistered(registeredData.username);
		},
	);
});

test.describe(
	"Register tests - v4",
	testDetails().withTags(TestTag.V4, JiraComponent.LOGIN_REGISTER).apply(),
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
				await homePage.unauthenticatedHeader.openRegisterModalV4();
				await homePage.registerModal
					.assertThat()
					.registerFormWithRegisterElementsAreDisplayedV4();
			},
		);

		test(
			`[ENG-9512] Verify new account creation flow`,
			testDetails()
				.withTags(JiraComponent.ACCOUNT_CREATION, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.IVAYLO_STOYCHEV)
				.apply(),
			async ({ homePage, toastV4, testDataObject }) => {
				const registerData = testDataObject.register.random();
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openRegisterModalV4();
				await homePage.registerModal
					.steps()
					.fillInCredentialsSuccessfullyV4(registerData, {
						acceptTermsOfService: true,
						acceptNewsOffers: true,
					});
				await homePage.registerModal.clickStartPlayingBtnV4();

				await homePage.authenticatedHeader
					.assertThat()
					.userIsRegisteredV4(registerData.username);

				await toastV4
					.assertThat()
					.toastMessageIsV4(
						ToastTitle.SUCCESS,
						ToastSubTitle.RESEND_EMAIL,
					);
			},
		);
	},
);
