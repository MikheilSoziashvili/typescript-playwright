import { RegisterTestData } from "@dtos/test-data";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info data",
	{
		tag: ["@admin-panel"],
	},
	() => {
		test.use(storageStateNewSuperAdminUserDB());

		test(`[ENG-4994] User info - confirm username and user id are displayed`, async ({
			gamdomApi,
			gamdomDb,
			userInfoAdminPage,
			infoAdminPage,
		}) => {
			const newUserData = new RegisterTestData();

			await gamdomDb.createNewUser(newUserData);

			const userId = (
				await gamdomApi.getBasicInfo(
					newUserData.username,
					newUserData.password,
				)
			).user.id;

			await userInfoAdminPage
				.steps()
				.navigateAndShowUserDetails(newUserData.username);

			await infoAdminPage
				.assertThat()
				.isUsernameDisplayedInTitle(newUserData.username);

			await infoAdminPage
				.assertThat()
				.userIdIsPresentInTable(userId.toString());
		});
	},
);
