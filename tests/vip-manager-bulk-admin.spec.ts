import {
	SUPER_ADMIN_VIP_MANAGER_BULK,
	SUPER_ADMIN_VIP_MANAGER_NO_BULK,
} from "@constants/credentials";
import { ToastSubTitle } from "@enums/toast-subtitles";
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
						.assertThat()
						.checkBatchUpdateVipPlayersStatusElements(
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
				toast,
			}) => {
				await vipManagerAdminPage.navigate();
				await vipManagerAdminPage
					.assertThat()
					.pageMainBlocksAreVisible();

				await vipManagerAdminPage
					.assertThat()
					.checkBatchUpdateVipPlayersStatusElements(true);

				await vipManagerAdminPage
					.steps()
					.toggleUpdateRemoveBatchVipPlayers(
						vipManagerAdminPage.map
							.updateBatchVipPlayersStatusButton,
					);
				await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
					filePath,
				);
				await vipManagerAdminPage.uploadUpdateRemoveBatchVipPlayersFile();
				await toast.assertThat().titleIs(ToastTitle.FAILED);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.UPLOAD_CSV_FILE);

				await vipManagerAdminPage
					.steps()
					.toggleUpdateRemoveBatchVipPlayers(
						vipManagerAdminPage.map
							.removeBatchVipPlayersStatusButton,
					);
				await vipManagerAdminPage.updateRemoveBatchVipPlayersSendFile(
					filePath,
				);
				await vipManagerAdminPage.uploadUpdateRemoveBatchVipPlayersFile();
				await toast.assertThat().titleIs(ToastTitle.FAILED);
				await toast
					.assertThat()
					.subTitleIs(ToastSubTitle.UPLOAD_CSV_FILE);
			});
		});
	});
});
