import { testDetails } from "@core/helpers/test-details-helper";
import {
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { faker } from "@faker-js/faker";
import { passwordPattern } from "@support/regex-patterns";
import { test } from "fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { CsvFilesName } from "@enums/csv-file-name";

test.describe("Password tests", () => {
	test.describe("Password Change Tests", () => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.CHANGE_PASSWORD,
			})
			.forEach((input) => {
				test(
					`[ENG-11781] Password change - ${input.scenario}`,
					testDetails()
						.withTags(
							JiraComponent.CHANGE_PASSWORD,
							JiraComponent.PROFILE, TestTag.ACCEPTANCE)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						passwordChangeSetupTestFlow,
						passwordChangeExecutionTestFlow,
						browserSessionManager,
						profilePage,
						mailpitApi,
						page,
						changePasswordModal,
						toast,
					}) => {
						const setupResult =
							await passwordChangeSetupTestFlow.setupPasswordChange(
								{
									browserSessionManager,
									profilePage,
									mailpitApi,
									page,
									changePasswordModal,
								},
							);

						await passwordChangeExecutionTestFlow.executePasswordChange(
							{
								changePasswordModal: changePasswordModal,
								toast: toast,
								input: input,
								userPassword: setupResult.userPassword,
							},
						);
					},
				);
			});
	});

	test.describe("Password reset", () => {
		test(
			"[ENG-1119] Password reset",
			testDetails().withAuthor(JiraUser.ANGEL_PETROV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				gamdomApiDbFacade,
				homePage,
				profilePage,
				mailpitApi,
				page,
				toast,
			}) => {
				let emailDetails = generateEmailAndInbox();
				const newUserPassword = faker.internet.password({
					length: 15,
					pattern: passwordPattern,
				});

				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({
						email: emailDetails.email,
					});

				emailDetails = generateEmailAndInbox(user.email);
				await setAuthenticationCookies(page, cookie);

				await profilePage.steps().logoutUserSuccessfully();
				await homePage.navigateAndCheckTitle();
				await homePage.unauthenticatedHeader.openLoginModal();
				await homePage.steps().resetPassword(user.email);
				await homePage
					.steps()
					.changePasswordFromEmail(
						newUserPassword,
						mailpitApi,
						emailDetails.email,
						page,
						{ messageIndex: 1 },
						"Password Reset",
					);

				await toast
					.assertThat()
					.toastMessageIs(
						ToastTitle.SUCCESS,
						ToastSubTitle.PASSWORD_CHANGED,
					);

				await homePage.navigateAndCheckTitle();
				await homePage
					.steps()
					.loginUser(user.username, newUserPassword);
			},
		);
	});
});

test.describe("Password reset - v4", () => {
	test.slow();
	test(
		"[ENG-9510] Password reset - v4",
		testDetails()
			.withTags(TestTag.V4, JiraComponent.PASSWORD_RESET, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.RALUCA_ARITON)
			.apply(),
		async ({ browserSessionManager, mailpitApi, page }) => {
			let emailDetails = generateEmailAndInbox();

			const newUserPassword = testData()
				.fromRandom()
				.data.password.password();

			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{ reuseContext: true, regularUserOptions: emailDetails },
			);

			emailDetails = generateEmailAndInbox(
				regularUser.getAuthenticatedUser().user.email,
			);

			await regularUser.pages.profilePage
				.steps()
				.logoutUserSuccessfullyV4();
			await regularUser.pages.homePage.navigateAndCheckTitle();
			await regularUser.pages.homePage.unauthenticatedHeader.openLoginModalV4();
			await regularUser.pages.homePage
				.steps()
				.resetPasswordV4(regularUser.getAuthenticatedUser().user.email);
			await regularUser.pages.homePage
				.steps()
				.changePasswordFromEmailV4(
					newUserPassword,
					mailpitApi,
					emailDetails.email,
					page,
					{ messageIndex: 1 },
					"Password Reset",
				);

			await regularUser.pages.toastV4
				.assertThat()
				.toastMessageIsV4(
					ToastTitle.SUCCESS_V4,
					ToastSubTitle.PASSWORD_CHANGED,
				);

			await regularUser.pages.homePage.navigateAndCheckTitle();
			await regularUser.pages.homePage
				.steps()
				.loginUserV4(
					regularUser.getAuthenticatedUser().user.username,
					newUserPassword,
				);
		},
	);
});
