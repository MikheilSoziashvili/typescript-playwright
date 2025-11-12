import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { InitialVerificationStatus } from "@enums/verification-enums";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"KYC Level 1 Verification",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		test.beforeEach(
			async ({ page, gamdomApiDbFacade, verificationPage }) => {
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);

				await verificationPage.navigate();
				await verificationPage
					.assertThat()
					.verificationPageTitleAndTabsAreVisible();
			},
		);

		verificationTestData.level1VerificationScenarios.forEach(
			({
				testId,
				formType,
				fillSubmissionForm,
				expectedNotificationTitle,
				expectedNotificationSubTitle,
				expectedToastTitle,
				expectedToastSubTitle,
			}) => {
				test(
					`[${testId}] Submit ${formType} Level 1`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({ homePage, verificationPage, toast }) => {
						await fillSubmissionForm(verificationPage);
						const notification = homePage.getNotification();
						await notification
							.assertThat()
							.titleIs(expectedNotificationTitle);
						await notification
							.assertThat()
							.subTitleIs(expectedNotificationSubTitle);

						await toast.assertThat().titleIs(expectedToastTitle);
						await toast
							.assertThat()
							.subTitleIs(expectedToastSubTitle);
					},
				);
			},
		);

		verificationTestData.level1FieldValidationScenarios.forEach(
			({
				testId,
				formType,
				fieldValidations,
				clearFieldValidations,
				processInput,
				tabType,
			}) => {
				test(
					`[${testId}] ${formType} Level 1 - Field validations`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({ verificationPage }) => {
						await verificationPage.selectVerificationTab(tabType);

						for (const {
							inputField,
							input,
							expectedErrorMessage,
						} of fieldValidations) {
							const actualInput = processInput(input);

							await verificationPage.fillInputAndTriggerValidation(
								inputField,
								actualInput,
							);

							await verificationPage
								.assertThat()
								.validateErrorMessageForField(
									inputField,
									expectedErrorMessage,
								);
						}

						await verificationPage.clearFieldsUsingClearButton(
							clearFieldValidations,
						);
						await verificationPage
							.assertThat()
							.fieldsAreCleared(clearFieldValidations);

						await verificationPage.toggleCheckbox({ count: 2 });
						await verificationPage
							.assertThat()
							.checkboxValidationMessageIsDisplayed();
					},
				);
			},
		);
	},
);

test.describe(
	"KYC Level 2 Verification - Veriff Portal",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const kycLevel2Scenarios = testData().fromCsvParsed({
			file: CsvFilesName.KYC_LEVEL2_SUBMISSIONS,
		});

		let userId: string;
		let documentImage: string;

		test.beforeEach(
			async ({ browserSessionManager, testDataPredefined }) => {
				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{ reuseContext: true },
				);
				userId = regularUser
					.getAuthenticatedUser()
					.user.userId.toString();
				documentImage = testDataPredefined.data.veriff.documentImage;
			},
		);

		for (const { decision, reason } of kycLevel2Scenarios) {
			test(
				`[ENG-8616] Submit documents for KYC Level 2 - Decision: ${decision}, Reason: ${reason}`,
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
				async ({ verificationPage, veriffApi, veriffPortalPage }) => {
					await verificationPage
						.steps()
						.submitDocumentsForKycLevel2(
							veriffApi,
							userId,
							documentImage,
						);

					await veriffPortalPage
						.steps()
						.navigateToVeriffPortalAndLogIn();

					await veriffPortalPage
						.steps()
						.openVerificationDetails(
							userId,
							InitialVerificationStatus.SUBMITTED,
						);

					await veriffPortalPage
						.steps()
						.updateVerificationDecision(
							userId,
							InitialVerificationStatus.SUBMITTED,
							decision,
							reason,
						);

					await veriffPortalPage
						.assertThat()
						.verificationStatusIsUpdated(decision, reason);
				},
			);
		}
	},
);
