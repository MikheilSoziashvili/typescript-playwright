import {
	SUPER_ADMIN_VIP_MANAGER_BULK,
	SUPER_ADMIN_VIP_MANAGER_NO_BULK,
} from "@constants/credentials";
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

test.describe("VIP Manager admin bulk tests", () => {
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
});
