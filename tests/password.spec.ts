import { testDetails } from "@core/helpers/test-details-helper";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
	generateEmailAndInbox,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { faker } from "@faker-js/faker";
import { passwordPattern } from "@support/regex-patterns";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe("Password tests", () => {
	test.describe("Password Change Tests - 2FA", () => {
		let qrCode2FAImagePath: string;

		test.beforeEach(async () => {
			qrCode2FAImagePath = createPngImagePath();
		});

		test.afterEach(async () => {
			await deleteFilesWithFilePaths([qrCode2FAImagePath]);
		});

		testData()
			.fromCsvParsed({
				file: CsvFilesName.CHANGE_PASSWORD_2FA,
			})
			.forEach((input) => {
				test(
					`[ENG-11753] Change password with 2FA - ${input.scenario}`,
					testDetails()
						.withTags(
							JiraComponent.CHANGE_PASSWORD,
							JiraComponent.PROFILE,
						)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({
						passwordChange2FaSetupTestFlow,
						passwordChangeExecutionTestFlow,
						profilePage,
						settingsPage,
						changePasswordModal,
						toast,
					}) => {
						const { userPassword } =
							await passwordChange2FaSetupTestFlow.setup2FaPasswordChange({
								profilePage,
								settingsPage,
								changePasswordModal,
								qrCode2FAImagePath,
							});

						await passwordChangeExecutionTestFlow.executePasswordChange({
							changePasswordModal,
							toast,
							input,
							userPassword,
						});
					},
				);
			});
	});

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
			"[ENG-9510] Password reset",
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
