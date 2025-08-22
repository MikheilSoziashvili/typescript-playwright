import { testDetails } from "@core/helpers/test-details-helper";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Homepage", () => {
	test(
		"[ENG-2954] Homepage big banner is correct",
		testDetails().withTags(TestTag.VISUAL).apply(),
		async ({ homePage }, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().topBannerVisualCorrect(testInfo);
		},
	);
});
