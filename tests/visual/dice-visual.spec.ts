import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Dice", () => {
	test("[ENG-3016] Dice manual bet menu is visually correct @visual", async ({
		diceGamePage,
	}, testInfo) => {
		await diceGamePage.navigate();
		await diceGamePage
			.assertThat()
			.diceManualBetMenuVisualIsCorrect(testInfo);
	});
});
