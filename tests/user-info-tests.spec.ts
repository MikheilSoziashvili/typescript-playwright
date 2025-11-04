import { DK_PROXY_CREDENTIALS, ES_PROXY_CREDENTIALS } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import { CountryCodes } from "@enums/country-codes";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";

test.describe(
	"User info tests",
	testDetails()
		.withTags(JiraComponent.ADMIN_PANEL, JiraComponent.USER_INFO)
		.apply(),
	() => {
		test(
			"[ENG-5086] User info -  verify that last_country property is updated correctly",
			testDetails().withAuthor(JiraUser.IVAYLO_STOYCHEV).apply(),
			async ({ browserSessionManager }) => {
				const dkProxySession = await browserSessionManager.loginAs(
					TestUserRole.ADMIN_USER_INFO_ADMIN,
					{ proxyCredentials: DK_PROXY_CREDENTIALS },
				);

				await dkProxySession.pages.userInfoAdminPage.navigate();
				await dkProxySession.pages.softblockModal
					.steps()
					.closeSoftblockModal();
				await dkProxySession.pages.userInfoAdminPage
					.steps()
					.showUserDetails(
						dkProxySession.getAuthenticatedUser().user.username,
					);
				await dkProxySession.pages.infoAdminPage
					.assertThat()
					.lastCountryCodeCorrect(CountryCodes.DK);

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
