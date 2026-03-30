import { ES_PROXY_CREDENTIALS, FR_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import { CountryCodes } from "@enums/country-codes";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";

test.describe(
	"User info tests",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		test(
			"[ENG-5086] User info -  verify that last_country property is updated correctly",
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ browserSessionManager }) => {
				const frProxySession = await browserSessionManager.loginAs(
					TestUserRole.ADMIN_USER_INFO_ADMIN,
					{ proxyCredentials: FR_PROXY_CREDENTIALS },
				);

				await frProxySession.pages.userInfoAdminPage.navigate();
				await frProxySession.pages.softblockModal
					.steps()
					.closeSoftblockModal();
				await frProxySession.pages.userInfoAdminPage
					.steps()
					.showUserDetails(
						frProxySession.getAuthenticatedUser().user.username,
					);
				await frProxySession.pages.infoAdminPage
					.assertThat()
					.lastCountryCodeCorrect(CountryCodes.FR);

				const esProxySession = await browserSessionManager.loginAs(
					TestUserRole.ADMIN_USER_INFO_ADMIN,
					{
						proxyCredentials: ES_PROXY_CREDENTIALS,
					},
				);

				await esProxySession.pages.userInfoAdminPage.navigate();
				await esProxySession.pages.softblockModal
					.steps()
					.closeSoftblockModal();
				await esProxySession.pages.userInfoAdminPage
					.steps()
					.showUserDetails(
						esProxySession.getAuthenticatedUser().user.username,
					);
				await esProxySession.pages.infoAdminPage
					.assertThat()
					.lastCountryCodeCorrect(CountryCodes.ES);
			},
		);
	},
);
