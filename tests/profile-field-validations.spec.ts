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

test.describe("Profile - Field validations", () => {
	const allRows = testData().fromCsvRaw({
		file: CsvFilesName.PHONE_NUMBER_VALIDATION,
	});

	const enabledRows = allRows.filter(
		(row) => row.buttonAction === ButtonAction.ENABLED,
	);
	const disabledRows = allRows.filter(
		(row) => row.buttonAction === ButtonAction.DISABLED,
	);

	test.describe("Phone number - submit and verify toast", () => {
		enabledRows.forEach((row) => {
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
		});
	});

	test.describe("Phone number - validation error", () => {
		disabledRows.forEach((row) => {
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
		});
	});
});
