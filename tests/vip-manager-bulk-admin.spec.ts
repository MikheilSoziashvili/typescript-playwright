import {
	SUPER_ADMIN_VIP_MANAGER_BULK,
	SUPER_ADMIN_VIP_MANAGER_NO_BULK,
} from "@constants/credentials";
import { DATA_TEST_FILES_DIR } from "@constants/file-paths";
import { parse_csv } from "@core/utils/utils";
import { BulkActions } from "@enums/bulk-actions";
import { ToastSubTitleDynamic } from "@enums/toast-subtitles-dynamic";
import { ToastTitle } from "@enums/toast-titles";
import { storageStateUserAPI } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const testDataInput = [
	{
		userCredentials: SUPER_ADMIN_VIP_MANAGER_NO_BULK,
		testDescriptionName: `[ENG-2330] Batch update VIP player status is absent for admin user with NO 'VipManagerBulkAdmin' tag assigned`,
		expectedBatchUpdatePresence: false,
		describeName: `Vip manager no bulk admin tests`,
	},
	{
		userCredentials: SUPER_ADMIN_VIP_MANAGER_BULK,
		testDescriptionName: `[ENG-2685] Batch update VIP player status is present for admin user with 'VipManagerBulkAdmin' tag assigned`,
		expectedBatchUpdatePresence: true,
		describeName: `Vip manager with bulk admin tests`,
	},
];

test.describe("VIP Manager admin tests", () => {
	testDataInput.forEach(
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

				test(`${testDescriptionName}`, async ({
					vipManagerAdminPage,
				}) => {
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
				});
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

		const fileFormats = ["txt", "pdf"];

		const wrongFormatFiles = fileFormats.map((format) => ({
			filePath: `./data-test-files/ENG-2366-vip-manager-${format}-wrong-file-format.${format}`,
			fileFormatType: format,
		}));

		wrongFormatFiles.forEach(({ filePath, fileFormatType }) => {
			test(`[ENG-2366] Vip Manager Bulk Admin - incorrect '${fileFormatType}' file format (different than .csv) can not be uploaded`, async ({
				vipManagerAdminPage,
			}) => {
				await vipManagerAdminPage.navigate();
				await vipManagerAdminPage
					.assertThat()
					.pageMainBlocksAreVisible();

				await vipManagerAdminPage
					.steps()
					.openBatchUpdateVipPlayersStatusModalSuccessfully();
				await vipManagerAdminPage
					.assertThat()
					.verifyBatchUpdateVipPlayersStatusElements(true);

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
			});
		});
	});

	testDataInput.forEach(({ userCredentials }) => {
		test.describe(`Vip Manager - "Send notification" section`, () => {
			test.use(
				storageStateUserAPI(
					userCredentials.username,
					userCredentials.password,
				),
			);

			test(`[ENG-2649] Vip Manager tab - verify that "Send notification" section is removed for '${userCredentials.username}' user`, async ({
				vipManagerAdminPage,
			}) => {
				await vipManagerAdminPage.navigate();
				await vipManagerAdminPage
					.assertThat()
					.pageMainBlocksAreVisible();

				await vipManagerAdminPage
					.assertThat()
					.checkSendNotificationSectionPresence(false);
			});
		});
	});

	test.describe(`Vip Manager - files with incorrect userIDs for bulk Update/Removal process`, () => {
		test.use(
			storageStateUserAPI(
				SUPER_ADMIN_VIP_MANAGER_BULK.username,
				SUPER_ADMIN_VIP_MANAGER_BULK.password,
			),
		);

		const bulkActions = [BulkActions.UPLOAD, BulkActions.REMOVE];

		const bulkActionFiles = bulkActions.map((bulkAction) => {
			const filePath = `./data-test-files/ENG-2332-batch-vip-status-incorrect-userId-${bulkAction}.csv`;
			const incorrectUserIdFromCsv = parse_csv(
				DATA_TEST_FILES_DIR,
				`ENG-2332-batch-vip-status-incorrect-userId-${bulkAction}.csv`,
				{
					columns: false,
				},
			) as string[];

			const expectedErrorMessage =
				bulkAction === BulkActions.UPLOAD
					? ToastSubTitleDynamic.INVALID_USER_ID(
							incorrectUserIdFromCsv[0][0],
					  )
					: ToastSubTitleDynamic.INVALID_USER_WITH_ID(
							incorrectUserIdFromCsv[0][0],
					  );

			return { filePath, bulkAction, expectedErrorMessage };
		});

		bulkActionFiles.forEach(
			({ filePath, bulkAction, expectedErrorMessage }) => {
				test(`[ENG-2332] Vip Manager Bulk Admin - Verify error received when upload .csv file containing incorrect userID for bulk '${bulkAction}' process`, async ({
					vipManagerAdminPage,
					toast,
				}) => {
					await vipManagerAdminPage.navigate();
					await vipManagerAdminPage
						.assertThat()
						.pageMainBlocksAreVisible();

					await vipManagerAdminPage
						.steps()
						.openBatchUpdateVipPlayersStatusModalSuccessfully();

					await vipManagerAdminPage
						.assertThat()
						.verifyBatchUpdateVipPlayersStatusElements(true);

					await vipManagerAdminPage
						.steps()
						.toggleUploadRemoveBatchVipPlayersByOption(bulkAction);
					await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
						filePath,
					);
					await vipManagerAdminPage.uploadUpdateRemoveBatchVipPlayersFile();
					await toast.assertThat().titleIs(ToastTitle.FAILED);
					await toast.assertThat().subTitleIs(expectedErrorMessage);
				});
			},
		);
	});
});
