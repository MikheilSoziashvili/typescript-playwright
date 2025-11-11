import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info data",
	testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
	() => {
		test.use(storageStateNewSuperAdminUserDB());

		test(
			`[ENG-4994] User info - confirm username and user id are displayed`,
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({
				gamdomApi,
				gamdomDb,
				userInfoAdminPage,
				infoAdminPage,
				testDataObject,
			}) => {
				const newUserData = testDataObject.register.random();

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
			},
		);
	},
);
