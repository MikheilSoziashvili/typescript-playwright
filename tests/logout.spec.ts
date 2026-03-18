import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";

test.describe("Logout tests", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-1541] Profile - logout",
		testDetails()
			.withTags(TestTag.SMOKE, JiraComponent.PROFILE, JiraComponent.AUTHENTICATION)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ profilePage, homePage }) => {
			await profilePage.navigate();
			await profilePage.steps().cancelLogout();
			await profilePage.continueModal.assertThat().isModalNotDisplayed();
			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();

			await profilePage.logout();
			await profilePage.continueModal.assertThat().isModalNotDisplayed();
			await homePage.unauthenticatedHeader
				.assertThat()
				.loggedOutUserElementsAreVisible();
		},
	);
});
