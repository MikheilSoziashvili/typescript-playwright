import {
	ALL_USER_TYPES_DISABLED,
	ALL_USER_TYPES_ENABLED,
} from "@constants/feature-configurations";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { testDetails } from "@core/helpers/test-details-helper";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { test } from "@fixtures/fixtures";

test.describe(
	"Affiliates - disable feature",
	testDetails().withTags(TestTag.SEQUENTIAL_PARALLEL).apply(),
	() => {
		let superadmin: BrowserUserSession;

		test.beforeEach(async ({ browserSessionManager }) => {
			superadmin = await browserSessionManager.loginAs(
				TestUserRole.SUPERADMIN,
				{ reuseContext: true },
			);

			await (
				await superadmin.apis.gamdomApi
			).setMultipleFeatureStates([
				{
					feature: Feature.AFFILIATES,
					states: ALL_USER_TYPES_DISABLED,
				},
				{
					feature: Feature.AFFILIATES_INFO,
					states: ALL_USER_TYPES_DISABLED,
				},
			]);
		});

		test(
			"[ENG-8799] Check the redirection of Affiliates button when the Affiliates and Affiliates Info features are disabled",
			testDetails()
				.withTags(JiraComponent.AFFILIATES, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ browserSessionManager, footer }) => {
				const expectedUrlPart = "/rewards";

				const regularUser = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{
						reuseContext: true,
					},
				);

				await regularUser.pages.homePage.navigate();
				await regularUser.pages.homePage
					.assertThat()
					.verifyAffiliatesRedirectWithRetry(footer, expectedUrlPart);

				await regularUser.pages.homePage.navigate({
					cookies: { clearCookies: true },
				});
				await regularUser.pages.homePage
					.assertThat()
					.verifyAffiliatesRedirectWithRetry(footer, expectedUrlPart);
			},
		);

		test.afterEach(async ({}) => {
			await (
				await superadmin.apis.gamdomApi
			).setMultipleFeatureStates([
				{
					feature: Feature.AFFILIATES,
					states: ALL_USER_TYPES_ENABLED,
				},
				{
					feature: Feature.AFFILIATES_INFO,
					states: ALL_USER_TYPES_ENABLED,
				},
			]);
		});
	},
);
