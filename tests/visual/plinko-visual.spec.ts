import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Plinko", () => {
	test.beforeAll(async ({}, testInfo) => {
		if (testInfo.project.name === "firefox") {
			testInfo.annotations.push({
				type: "performance",
				description: "https://gamdom.atlassian.net/browse/ENG-6628",
			});
		}
	});
	test("[ENG-2550] Sign-in button on Plinko @visual", async ({
		plinkoGamePage,
	}, testInfo) => {
		await plinkoGamePage.navigate();
		await plinkoGamePage.assertThat().signInButtonIsDisplayed();

		await plinkoGamePage.openLoginModal();
		await plinkoGamePage.assertThat().signInModalVisualIsCorrect(testInfo);
	});
});
