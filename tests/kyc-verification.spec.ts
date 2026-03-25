import { testDetails } from "@core/helpers/test-details-helper";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { Cryptocurrency } from "@enums/cryptocurrencies";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import {
	InitialVerificationStatus,
	KycAdminActions,
	kycAdminStatus,
	KycLevels,
	ProofOfFunds,
} from "@enums/verification-enums";
import { getCookieHeader } from "@core/utils/utils";
import { test } from "@fixtures/fixtures";
import { PROOF_OF_FUNDS_OPTIONS } from "test-data/domains/verification-domain-data";
import { testData } from "test-data/test-data-manager";

test.describe(
	"KYC Level 1 Verification",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		test.beforeEach(async ({ browserSessionManager, gamdomApi }) => {
			const adminUser = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
				{ reuseContext: true },
			);
			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{ reuseContext: true },
			);

			const superAdminCookie = getCookieHeader(
				adminUser.getAuthenticatedUser().cookie,
			);
			const userId = regularUser.getAuthenticatedUser().user.userId;

			await gamdomApi.triggerKycLevel(userId, KycLevels.LEVEL_1, {
				Cookie: superAdminCookie,
			});
		});

		verificationTestData.verificationEntryPoints.forEach(
			({ name, navigateToForm }) => {
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
							`[${testId}] Submit ${formType} Level 1 via ${name}`,
							testDetails()
								.withAuthor(JiraUser.NIKOLAY_GENOV)
								.withTags(TestTag.ACCEPTANCE)
								.apply(),
							async ({
								homePage,
								verificationPage,
								toast,
								walletModal,
							}) => {
								await navigateToForm({
									verificationPage,
									homePage,
									walletModal,
								});

								await fillSubmissionForm(verificationPage);

								await verificationPage
									.assertThat()
									.verifySubmissionToastAndNotification(
										toast,
										homePage.getNotification(),
										expectedToastTitle,
										expectedToastSubTitle,
										expectedNotificationTitle,
										expectedNotificationSubTitle,
									);
							},
						);
					},
				);
			},
		);

		verificationTestData.level1FieldValidationScenarios.forEach(
			({ testId, formType, fieldValidations, processInput, tabType }) => {
				test(
					`[${testId}] ${formType} Level 1 - Field validations`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ verificationPage }) => {
						await verificationPage.navigate();
						await verificationPage
							.assertThat()
							.verificationPageTitleAndTabsAreVisible();

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
	testDetails()
		.withTags(TestTag.SEQUENTIAL, JiraComponent.VERIFICATION)
		.apply(),
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
				testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
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

test.describe(
	"KYC Admin Actions - Trigger and Revoke",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		verificationTestData.kycAdminActionsScenarios.forEach(
			({ kycLevel, trigger, revoke }) => {
				test(
					`[ENG-8621] KYC Level ${kycLevel} - Trigger and Revoke`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ browserSessionManager }) => {
						const adminUser = await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
							{ reuseContext: true },
						);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);

						await adminUser.pages.cryptoAdminPage.navigate();
						await adminUser.pages.cryptoAdminPage.toggleCryptoOperations(
							[
								{
									cryptoName: Cryptocurrency.Bitcoin,
									deposit: true,
									withdraw: true,
								},
							],
						);

						await adminUser.pages.userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(
								regularUser.getAuthenticatedUser().user
									.username,
							);
						await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.KYC,
						);
						// ============================================================
						// STEP 1: TRIGGER KYC LEVEL
						// ============================================================
						await adminUser.pages.userInfoKycAdminPage
							.assertThat()
							.allKycCardsAndActionButtonsAreVisible(
								kycLevel,
								trigger.action,
							);
						await adminUser.pages.userInfoKycAdminPage.selectKycAction(
							kycLevel,
							trigger.action,
						);
						await trigger.assertToast(adminUser.pages.toast);
						await adminUser.pages.userInfoKycAdminPage
							.assertThat()
							.kycActionButtonAndStatusAreVisible(
								kycLevel,
								revoke.action,
								trigger.status,
							);
						await adminUser.pages.userInfoAdminPage.clickUserInfoTabAndRefresh(
							UserInfoTabs.Info,
						);
						await adminUser.pages.infoAdminPage
							.assertThat()
							.userWithdrawalButtonStatusIs(
								trigger.withdrawalStatusAfterAction,
							);

						await regularUser.pages.verificationPage.navigate();
						await trigger.assertVerificationPPage(
							regularUser.pages.verificationPage,
						);

						await regularUser.pages.homePage.navigateToWallet();
						await regularUser.pages.walletModal.openWithdrawTab();
						await trigger.assertWalletModal(
							regularUser.pages.walletModal,
						);
						// ============================================================
						// STEP 2: REVOKE KYC LEVEL
						// ============================================================
						await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.KYC,
						);
						await adminUser.pages.userInfoKycAdminPage.selectKycAction(
							kycLevel,
							revoke.action,
						);
						await revoke.assertToast(adminUser.pages.toast);
						await adminUser.pages.userInfoKycAdminPage
							.assertThat()
							.kycActionButtonAndStatusAreVisible(
								kycLevel,
								trigger.action,
								revoke.status,
							);
						await adminUser.pages.userInfoAdminPage.clickUserInfoTabAndRefresh(
							UserInfoTabs.Info,
						);
						await adminUser.pages.infoAdminPage
							.assertThat()
							.userWithdrawalButtonStatusIs(
								revoke.withdrawalStatusAfterAction,
							);

						await regularUser.pages.verificationPage.navigate();
						await revoke.assertVerificationPPage(
							regularUser.pages.verificationPage,
						);

						await regularUser.pages.homePage.navigateToWallet();
						await regularUser.pages.walletModal.openWithdrawTabAndSelectPaymentMethod(
							Cryptocurrency.Bitcoin,
						);
						await revoke.assertWalletModal(
							regularUser.pages.walletModal,
						);
					},
				);
			},
		);
	},
);

test.describe(
	"KYC Level 2.5 Verification",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		test.beforeEach(async ({ browserSessionManager, gamdomApi }) => {
			const adminUser = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
				{ reuseContext: true },
			);
			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
			);

			const superAdminCookie = getCookieHeader(
				adminUser.getAuthenticatedUser().cookie,
			);
			const userId = regularUser.getAuthenticatedUser().user.userId;

			await gamdomApi.triggerKycLevel(userId, KycLevels.LEVEL_2_5, {
				Cookie: superAdminCookie,
			});
		});

		verificationTestData.verificationEntryPoints.forEach(
			({ name, navigateToForm }) => {
				test(
					`[ENG-13429] Submit KYC Level 2.5 via ${name}`,
					testDetails()
						.withAuthor(JiraUser.NIKOLAY_GENOV)
						.withTags(TestTag.ACCEPTANCE)
						.apply(),
					async ({ homePage, verificationPage, walletModal }) => {
						await navigateToForm({
							verificationPage,
							homePage,
							walletModal,
						});

						await verificationPage.fillInKycLevel2_5Form();

						await verificationPage
							.assertThat()
							.levelFormIsNotVisible(KycLevels.LEVEL_2_5);
					},
				);
			},
		);

		test(
			"[ENG-13430] KYC Level 2.5 - Checkbox validation",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ verificationPage }) => {
				await verificationPage.navigate();

				await verificationPage.toggleCheckbox({
					count: 2,
					level: KycLevels.LEVEL_2_5,
				});
				await verificationPage
					.assertThat()
					.checkboxValidationMessageIsDisplayed();
			},
		);
	},
);

test.describe(
	"KYC Level 3 Verification",
	testDetails().withTags(JiraComponent.VERIFICATION).apply(),
	() => {
		const verificationTestData = testData().fromDomain().verification;

		test.beforeEach(async ({ browserSessionManager, gamdomApi }) => {
			const adminUser = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
				{ reuseContext: true },
			);
			const regularUser = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
			);

			const superAdminCookie = getCookieHeader(
				adminUser.getAuthenticatedUser().cookie,
			);
			const userId = regularUser.getAuthenticatedUser().user.userId;

			await gamdomApi.triggerKycLevel(userId, KycLevels.LEVEL_3, {
				Cookie: superAdminCookie,
			});
		});

		verificationTestData.verificationEntryPoints.forEach(
			({ name, navigateToForm }) => {
				PROOF_OF_FUNDS_OPTIONS.forEach((proofOfFund) =>
					test(
						`[ENG-13431] Submit KYC Level 3 - ${proofOfFund} via ${name}`,
						testDetails()
							.withAuthor(JiraUser.NIKOLAY_GENOV)
							.withTags(TestTag.ACCEPTANCE)
							.apply(),
						async ({ homePage, verificationPage, walletModal }) => {
							await navigateToForm({
								verificationPage,
								homePage,
								walletModal,
							});

							await verificationPage.fillInKycLevel3Form(
								proofOfFund,
							);
							await verificationPage
								.assertThat()
								.kycLevelThreeVerificationInProgressMessageIsVisible();
						},
					),
				);
			},
		);

		test(
			"[ENG-13432] KYC Level 3 - File upload and checkbox validation",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ verificationPage }) => {
				await verificationPage.navigate();

				await verificationPage.uploadProofOfFundsFile(
					ProofOfFunds.BANK_STATEMENT,
				);
				await verificationPage.removeUploadedFile();
				await verificationPage
					.assertThat()
					.fileUploadErrorMessageIsDisplayed();

				await verificationPage.toggleCheckbox({
					count: 2,
					level: KycLevels.LEVEL_3,
				});
				await verificationPage
					.assertThat()
					.checkboxValidationMessageIsDisplayed();
			},
		);

		verificationTestData.kycLevel3ReviewActions.forEach(
			({
				testId,
				action,
				approveOrRejectSubmission,
				expectedToastTitle,
				expectedToastSubTitle,
				expectedStatus,
				expectedButtons,
			}) =>
				test(
					`[${testId}] [ENG-8674] ${action} KYC Level 3 in Admin`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ browserSessionManager }) => {
						const adminUser = await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
							{ reuseContext: true },
						);
						const regularUser = await browserSessionManager.loginAs(
							TestUserRole.REGULAR,
						);
						await regularUser.pages.verificationPage.fillInKycLevel3Form(
							ProofOfFunds.BANK_STATEMENT,
						);
						await regularUser.pages.verificationPage
							.assertThat()
							.kycLevelThreeVerificationInProgressMessageIsVisible();

						await adminUser.pages.userInfoKycAdminPage.refresh();
						await adminUser.pages.userInfoKycAdminPage
							.assertThat()
							.kycActionButtonAndStatusAreVisible(
								KycLevels.LEVEL_3,
								KycAdminActions.REVIEW_DATA,
								kycAdminStatus.NEEDS_REVIEW,
							);

						await approveOrRejectSubmission(
							adminUser.pages.userInfoKycAdminPage.steps(),
						);

						await adminUser.pages.toast
							.assertThat()
							.toastMessageIs(
								expectedToastTitle,
								expectedToastSubTitle,
							);

						await adminUser.pages.userInfoKycAdminPage
							.assertThat()
							.kycActionButtonsAndStatusAreVisible(
								KycLevels.LEVEL_3,
								expectedButtons,
								expectedStatus,
							);
					},
				),
		);
	},
);
