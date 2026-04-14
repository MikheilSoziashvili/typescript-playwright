import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestUserRole } from "@enums/test-user-roles";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Settings - Toggles Section", () => {
	test(
		"[ENG-13680] Verify 'Receive News and Offers' toggle",
		testDetails()
			.withAuthor(JiraUser.RALUCA_ARITON)
			.withTags(JiraComponent.PROFILE_SETTINGS, TestTag.ACCEPTANCE)
			.apply(),
		async ({ browserSessionManager, gamdomDb }) => {
			const user = await browserSessionManager.loginAs(
				TestUserRole.REGULAR,
				{ reuseContext: true },
			);
			const userId = user.getAuthenticatedUser().user.userId;

			await user.pages.settingsPage.navigate();

			await user.pages.settingsPage
				.steps()
				.toggleReceiveNewsAndOffersAndVerify(true, gamdomDb, userId);

			await user.pages.settingsPage
				.steps()
				.toggleReceiveNewsAndOffersAndVerify(false, gamdomDb, userId);
		},
	);
});
