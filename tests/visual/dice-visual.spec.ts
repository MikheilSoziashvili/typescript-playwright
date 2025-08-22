import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Dice", () => {
	test(
		"[ENG-3016] Dice manual bet menu is visually correct",
		testDetails().withTags(TestTag.VISUAL).apply(),
		async ({ diceGamePage }, testInfo) => {
			await diceGamePage.navigate();
			await diceGamePage
				.assertThat()
				.diceManualBetMenuVisualIsCorrect(testInfo);
		},
	);
});
