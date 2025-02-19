import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Plinko", () => {
	test("[ENG-2550] Sign-in button on Plinko @visual", async ({
		plinkoGamePage,
	}, testInfo) => {
		await plinkoGamePage.navigate();
		await plinkoGamePage.assertThat().signInButtonIsDisplayed();

		await plinkoGamePage.openLoginModal();
		await plinkoGamePage.assertThat().signInModalVisualIsCorrect(testInfo);
	});
});
