import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Homepage", () => {
	test(
		"[ENG-2954] Homepage big banner is correct",
		testDetails()
			.withTags(TestTag.VISUAL, JiraComponent.HOMEPAGE, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.NIKOLAY_GENOV)
			.apply(),
		async ({ homePage }, testInfo) => {
			await homePage.navigateAndCheckTitle();
			await homePage.assertThat().topBannerVisualCorrect(testInfo);
		},
	);
});
