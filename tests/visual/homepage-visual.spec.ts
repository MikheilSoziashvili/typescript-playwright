import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Homepage", () => {
	test("[ENG-2954] Homepage big banner is correct @visual", async ({
		homePage,
	}, testInfo) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().topBannerVisualCorrect(testInfo);
	});
});
