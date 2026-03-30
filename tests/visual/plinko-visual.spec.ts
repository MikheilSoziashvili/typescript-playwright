import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe(
	"Visual Tests - Plinko",
	testDetails().withTags(TestTag.VISUAL, JiraComponent.PLINKO).apply(),
	() => {
		test(
			"[ENG-2550] Sign-in button on Plinko",
			testDetails()
				.withTags(TestTag.VISUAL, JiraComponent.PLINKO, TestTag.ACCEPTANCE)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ plinkoGamePage }, testInfo) => {
				await plinkoGamePage.navigate();
				await plinkoGamePage.assertThat().signInButtonIsDisplayed();

				await plinkoGamePage.openLoginModal();
				await plinkoGamePage
					.assertThat()
					.signInModalVisualIsCorrect(testInfo);
			},
		);
	},
);
