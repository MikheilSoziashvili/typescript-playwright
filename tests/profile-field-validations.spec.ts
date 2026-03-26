import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { CsvFilesName } from "@enums/csv-file-name";
import { TestUserRole } from "@enums/test-user-roles";
import { ButtonAction } from "@enums/button-actions";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { testData } from "test-data/test-data-manager";

const filterByButtonAction = <T extends { buttonAction: string }>(
	rows: T[],
	action: ButtonAction,
): T[] => rows.filter((row) => row.buttonAction === action);

test.describe("Profile - Field validations", () => {
	const phoneRows = testData().fromCsvRaw({
		file: CsvFilesName.PHONE_NUMBER_VALIDATION,
	});
	const emailRows = testData().fromCsvRaw({
		file: CsvFilesName.EMAIL_ADDRESS_VALIDATION,
	});
	const usernameRows = testData().fromCsvRaw({
		file: CsvFilesName.USERNAME_VALIDATION,
	});

	test.describe("Username - submit and verify toast", () => {
		filterByButtonAction(usernameRows, ButtonAction.ENABLED).forEach(
			(row) => {
				test(
					`[ENG-11754] Username validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.submitUsernameAndVerifyToast(
								row.inputValue,
								row.expectedResult as ToastTitle,
								row.notificationMessage as ToastSubTitle,
							);
					},
				);
			},
		);
	});

	test.describe("Username - validation error", () => {
		filterByButtonAction(usernameRows, ButtonAction.DISABLED).forEach(
			(row) => {
				test(
					`[ENG-11754] Username validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.fillUsernameAndVerifyValidationError(
								row.inputValue,
								row.notificationMessage,
							);
					},
				);
			},
		);
	});

	test.describe("Email address - save button enabled", () => {
		filterByButtonAction(emailRows, ButtonAction.ENABLED).forEach(
			(row) => {
				test(
					`[ENG-11755] Email address validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.fillEmailAndVerifySaveButtonEnabled(
								row.inputValue,
							);
					},
				);
			},
		);
	});

	test.describe("Email address - validation error", () => {
		filterByButtonAction(emailRows, ButtonAction.DISABLED).forEach(
			(row) => {
				test(
					`[ENG-11755] Email address validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.fillEmailAndVerifyValidationError(
								row.inputValue,
								row.notificationMessage,
							);
					},
				);
			},
		);
	});

	test.describe("Phone number - submit and verify toast", () => {
		filterByButtonAction(phoneRows, ButtonAction.ENABLED).forEach(
			(row) => {
				test(
					`[ENG-11756] Phone number validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.submitPhoneNumberAndVerifyToast(
								row.inputValue,
								row.expectedResult as ToastTitle,
								row.notificationMessage as ToastSubTitle,
							);
					},
				);
			},
		);
	});

	test.describe("Phone number - validation error", () => {
		filterByButtonAction(phoneRows, ButtonAction.DISABLED).forEach(
			(row) => {
				test(
					`[ENG-11756] Phone number validation - ${row.comments}`,
					testDetails()
						.withTags(JiraComponent.PROFILE)
						.withAuthor(JiraUser.RALUCA_ARITON)
						.apply(),
					async ({ browserSessionManager, profilePage }) => {
						await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
							{ reuseContext: true },
						);

						await profilePage.navigate();
						await profilePage
							.steps()
							.fillPhoneNumberAndVerifyValidationError(
								row.inputValue,
								row.notificationMessage,
							);
					},
				);
			},
		);
	});
});
