import { SUPER_ADMIN_VIP_MANAGER_BULK } from "@constants/credentials";
import { buildFreeSpinsBatchProcessedWithErrorsToastSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";

test.describe(
	"VIP Manager admin tests",
	testDetails().withTags(JiraComponent.VIP_MANAGER).apply(),
	() => {
		const vipManagerTestDataDomain = testData().fromDomain().vipManager;

		vipManagerTestDataDomain.batchUpdateScenarios.forEach(
			({
				userCredentials,
				testDescriptionName,
				expectedBatchUpdatePresence,
				describeName,
			}) => {
				test.describe(`${describeName}`, () => {
					test.use(
						storageStateUserAPI(
							userCredentials.username,
							userCredentials.password,
						),
					);

					test(
						`${testDescriptionName}`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ vipManagerAdminPage }) => {
							await vipManagerAdminPage.navigate();
							await vipManagerAdminPage
								.assertThat()
								.pageMainBlocksAreVisible();

							await vipManagerAdminPage
								.steps()
								.openBatchUpdateVipPlayersStatusModalSuccessfully();
							await vipManagerAdminPage
								.assertThat()
								.verifyBatchUpdateVipPlayersStatusElements(
									expectedBatchUpdatePresence,
								);
						},
					);
				});
			},
		);

		test.describe(`Vip Manager - incorrect file format`, () => {
			test.use(
				storageStateUserAPI(
					SUPER_ADMIN_VIP_MANAGER_BULK.username,
					SUPER_ADMIN_VIP_MANAGER_BULK.password,
				),
			);

			vipManagerTestDataDomain.wrongFormatFilesScenarios.forEach(
				({ filePath, fileFormatType }) => {
					test(
						`[ENG-2366] Vip Manager Bulk Admin - incorrect '${fileFormatType}' file format (different than .csv) can not be uploaded`,
						testDetails()
							.withTags(JiraComponent.ADMIN)
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ vipManagerAdminPage }) => {
							await vipManagerAdminPage.navigate();
							await vipManagerAdminPage
								.assertThat()
								.pageMainBlocksAreVisible();

							await vipManagerAdminPage
								.steps()
								.openBatchUpdateVipPlayersStatusModalSuccessfully();
							await vipManagerAdminPage
								.assertThat()
								.verifyBatchUpdateVipPlayersStatusElements(
									true,
								);

							await vipManagerAdminPage
								.steps()
								.toggleUpdateRemoveBatchVipPlayers(
									vipManagerAdminPage.map
										.updateBatchVipPlayersStatusButton,
								);
							await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
								filePath,
							);

							await vipManagerAdminPage
								.assertThat()
								.verifyUploadFilesButtonIsDisabled();

							await vipManagerAdminPage
								.steps()
								.toggleUpdateRemoveBatchVipPlayers(
									vipManagerAdminPage.map
										.removeBatchVipPlayersStatusButton,
								);
							await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
								filePath,
							);

							await vipManagerAdminPage
								.assertThat()
								.verifyUploadFilesButtonIsDisabled();
						},
					);
				},
			);
		});

		vipManagerTestDataDomain.batchUpdateScenarios.forEach(
			({ userCredentials }) => {
				test.describe(`Vip Manager - "Send notification" section`, () => {
					test.use(
						storageStateUserAPI(
							userCredentials.username,
							userCredentials.password,
						),
					);

					test(
						`[ENG-2649] Vip Manager tab - verify that "Send notification" section is removed for '${userCredentials.username}' user`,
						testDetails()
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ vipManagerAdminPage }) => {
							await vipManagerAdminPage.navigate();
							await vipManagerAdminPage
								.assertThat()
								.pageMainBlocksAreVisible();

							await vipManagerAdminPage
								.assertThat()
								.checkSendNotificationSectionPresence(false);
						},
					);
				});
			},
		);

		test.describe(`Vip Manager - files with incorrect userIDs for bulk Update/Removal process`, () => {
			test.use(
				storageStateUserAPI(
					SUPER_ADMIN_VIP_MANAGER_BULK.username,
					SUPER_ADMIN_VIP_MANAGER_BULK.password,
				),
			);

			vipManagerTestDataDomain.incorrectUserIdBulkFilesScenarios.forEach(
				({
					filePath,
					bulkAction,
					expectedSuccessToastMessage,
					expectedErrorMessage,
				}) => {
					test(
						`[ENG-2332] Vip Manager Bulk Admin - Verify error received when upload .csv file containing incorrect userID for bulk '${bulkAction}' process`,
						testDetails()
							.withTags(JiraComponent.ADMIN)
							.withAuthor(JiraUser.IVAYLO_STOYCHEV)
							.apply(),
						async ({ vipManagerAdminPage, toast }) => {
							await vipManagerAdminPage.navigate();
							await vipManagerAdminPage
								.assertThat()
								.pageMainBlocksAreVisible();

							await vipManagerAdminPage
								.steps()
								.openBatchUpdateVipPlayersStatusModalSuccessfully();

							await vipManagerAdminPage
								.assertThat()
								.verifyBatchUpdateVipPlayersStatusElements(
									true,
								);

							await vipManagerAdminPage
								.steps()
								.toggleUploadRemoveBatchVipPlayersByOption(
									bulkAction,
								);
							await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
								filePath,
							);
							await vipManagerAdminPage.uploadUpdateRemoveBatchVipPlayersFile();

							await toast.assertThat().titlesAre([
								{
									title: ToastTitle.SYSTEM,
									subTitle:
										buildFreeSpinsBatchProcessedWithErrorsToastSubTitle(
											0,
										),
								},
								{
									title: ToastTitle.SUCCESS,
									subTitle: expectedSuccessToastMessage,
								},
							]);

							await vipManagerAdminPage
								.assertThat()
								.errorLogsTextIs(expectedErrorMessage);
						},
					);
				},
			);
		});
	},
);
