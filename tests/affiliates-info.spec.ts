import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { AFFILIATES_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Affiliates info page",
	testDetails().withTags(JiraComponent.AFFILIATES).apply(),
	() => {
		test(
			"[ENG-13436] Join Now button redirects authenticated user to affiliates dashboard and opens login modal for unauthenticated user",
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(JiraComponent.AFFILIATES, TestTag.ACCEPTANCE)
				.apply(),
			async ({ browserSessionManager }) => {
				const user = await browserSessionManager.loginAs(
					TestUserRole.REGULAR,
					{
						reuseContext: true,
					},
				);

				await user.pages.affiliatesInfoPage
					.steps()
					.navigateAndVerifyPageIsDisplayed();

				await user.pages.affiliatesInfoPage.clickJoinNow();
				await user.pages.affiliatesPage
					.assertThat()
					.waitForAndVerifyCurrentUrlIs(AFFILIATES_PAGE_ENDPOINT);

				await user.pages.profilePage.steps().logoutUserSuccessfully();

				await user.pages.affiliatesInfoPage
					.steps()
					.navigateAndVerifyPageIsDisplayed();

				await user.pages.affiliatesInfoPage.clickJoinNow();
				await user.pages.loginModal
					.assertThat()
					.loginModalIsDisplayed();
			},
		);
	},
);
