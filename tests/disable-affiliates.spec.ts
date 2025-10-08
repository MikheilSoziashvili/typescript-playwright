import {
	ALL_USER_TYPES_DISABLED,
	ALL_USER_TYPES_ENABLED,
} from "@constants/feature-configurations";
import { testDetails } from "@core/helpers/test-details-helper";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe.serial(
	"Affiliates - disable feature",
	testDetails().withTags(TestTag.SEQUENTIAL).apply(),
	() => {
		let superAdminCookie: string;

		test.beforeEach(async ({ gamdomApiDbFacade, gamdomApi, page }) => {
			const { cookie } =
				await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
			superAdminCookie = getCookieHeader(cookie);
			await setAuthenticationCookies(page, cookie);

			await gamdomApi.setMultipleFeatureStates(
				[
					{
						feature: Feature.AFFILIATES,
						states: ALL_USER_TYPES_DISABLED,
					},
					{
						feature: Feature.AFFILIATES_INFO,
						states: ALL_USER_TYPES_DISABLED,
					},
				],
				{ Cookie: superAdminCookie },
			);
		});

		test(
			"[ENG-8799] Check the redirection of Affiliates button when the Affiliates and Affiliates Info features are disabled",
			testDetails()
				.withTags(JiraComponent.AFFILIATES)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ homePage, gamdomApiDbFacade, footer }) => {
				const expectedUrlPart = "/rewards";

				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(homePage.page, cookie);

				await homePage.navigate();
				await homePage
					.assertThat()
					.verifyAffiliatesRedirectWithRetry(footer, expectedUrlPart);

				await homePage.navigate({
					cookies: { clearCookies: true },
				});
				await homePage
					.assertThat()
					.verifyAffiliatesRedirectWithRetry(footer, expectedUrlPart);
			},
		);

		test.afterAll(async ({ gamdomApi }) => {
			await gamdomApi.setMultipleFeatureStates(
				[
					{
						feature: Feature.AFFILIATES,
						states: ALL_USER_TYPES_ENABLED,
					},
					{
						feature: Feature.AFFILIATES_INFO,
						states: ALL_USER_TYPES_ENABLED,
					},
				],
				{ Cookie: superAdminCookie },
			);
		});
	},
);
