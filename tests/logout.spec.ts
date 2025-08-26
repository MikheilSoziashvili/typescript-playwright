import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "../fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { JiraUser } from "@enums/jira/jira-users";

test.describe("Logout tests", () => {
	test.use(storageStateNewUserDB());
	test(
		"[ENG-1541] Profile - logout",
		testDetails()
			.withTags(TestTag.SMOKE)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ profilePage, homePage }) => {
			await profilePage.navigate();
			await profilePage.steps().cancelLogout();
			await profilePage.continueModal.assertThat().isNotDisplayed();
			await homePage.authenticatedHeader
				.assertThat()
				.loggedInUserElementsAreVisible();

			await profilePage.logout();
			await profilePage.continueModal.assertThat().isNotDisplayed();
			await homePage.unauthenticatedHeader
				.assertThat()
				.loggedOutUserElementsAreVisible();
		},
	);
});
