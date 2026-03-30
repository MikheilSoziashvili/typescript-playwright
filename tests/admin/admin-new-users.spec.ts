import { test } from "@fixtures/fixtures";
import { JiraUser } from "@enums/jira/jira-users";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { TestUserRole } from "@enums/test-user-roles";
import { testData } from "test-data/test-data-manager";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Admin - New Users",
	testDetails().withTags(JiraComponent.ADMIN_PANEL).apply(),
	() => {
		const adminNewUsersTestDataDomain =
			testData().fromDomain().adminNewUsers;

		adminNewUsersTestDataDomain.fetchUsersByFilterScenarios.forEach(
			({ fetchUsersByFilterName, fetchUsersByFilterStep }) => {
				test(
					`[ENG-4968] Admin - New Users attributes verification - ${fetchUsersByFilterName}`,
					testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
					async ({ browserSessionManager, testDataPredefined }) => {
						const superadmin = await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
							{ reuseContext: true },
						);

						await superadmin.pages.newUsersAdminPage.navigate();

						await fetchUsersByFilterStep(
							superadmin.pages.newUsersAdminPage,
							testDataPredefined,
						);

						await superadmin.pages.newUsersAdminPage
							.assertThat()
							.newUsersTableAllColumnsAndRowsPresent();
					},
				);
			},
		);
	},
);
