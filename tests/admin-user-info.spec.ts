import { testDetails } from "@core/helpers/test-details-helper";
import { RegisterTestData } from "@dtos/test-data";
import { JiraComponent } from "@enums/jira/jira-components";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info data",
	testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
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
