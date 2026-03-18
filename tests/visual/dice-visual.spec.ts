import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Dice", () => {
	test(
		"[ENG-3016] Dice manual bet menu is visually correct",
		testDetails()
			.withTags(TestTag.VISUAL, JiraComponent.GAMDOM_ORIGINALS)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ diceGamePage }, testInfo) => {
			await diceGamePage.navigate();
			await diceGamePage
				.assertThat()
				.diceManualBetMenuVisualIsCorrect(testInfo);
		},
	);
});
