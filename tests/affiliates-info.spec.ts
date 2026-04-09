import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { AFFILIATES_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Affiliates info page",
	testDetails()
		.withTags(JiraComponent.AFFILIATES)
		.withTags(TestTag.ACCEPTANCE)
		.apply(),
	() => {
		test(
			"[ENG-13436] Join Now button redirects authenticated user to affiliates dashboard and opens login modal for unauthenticated user",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
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

		test(
			"[ENG-13420] Download Gamdom Templates button opens Dropbox with banners and logos",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
			async ({ affiliatesInfoPage, dropboxApi }) => {
				await affiliatesInfoPage.navigate();
				await affiliatesInfoPage.assertThat().pageIsDisplayed();

				await affiliatesInfoPage
					.assertThat()
					.gamdomTemplatesSectionIsDisplayed();

				const dropboxUrl = await affiliatesInfoPage.steps().getDownloadTemplatesUrl();
				await affiliatesInfoPage.clickDownloadTemplates();
				await affiliatesInfoPage
					.assertThat()
					.downloadTemplatesOpensDropboxInNewTab();
				await dropboxApi.checkUrlIsReachable(dropboxUrl);
			},
		);
	},
);
