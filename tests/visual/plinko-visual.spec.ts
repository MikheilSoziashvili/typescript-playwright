import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Plinko", () => {
	test(
		"[ENG-2550] Sign-in button on Plinko @visual",
		testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
		async ({ plinkoGamePage }, testInfo) => {
			await plinkoGamePage.navigate();
			await plinkoGamePage.assertThat().signInButtonIsDisplayed();

			await plinkoGamePage.openLoginModal();
			await plinkoGamePage
				.assertThat()
				.signInModalVisualIsCorrect(testInfo);
		},
	);
});
