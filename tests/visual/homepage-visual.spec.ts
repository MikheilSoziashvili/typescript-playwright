import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Homepage", () => {
	test("Homepage Usain Bolt banner is correct @visual", async ({
		homePage,
	}) => {
		await homePage.navigateAndCheckTitle();
		await homePage.assertThat().topBannerVisualCorrect();
	});
});
