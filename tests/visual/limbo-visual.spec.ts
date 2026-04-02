import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame } from "@enums/original-games";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Limbo", () => {
	test(
		"[ENG-12028] Limbo is visually correct in originals sub navigation header",
		testDetails()
			.withTags(
				TestTag.VISUAL,
				JiraComponent.GAMDOM_ORIGINALS,
				JiraComponent.LIMBO,
			)
			.withAuthor(JiraUser.IVAYLO_STOYCHEV)
			.apply(),
		async ({ homePage }, testInfo) => {
			await homePage.navigate();
			await homePage.hoverOnOriginalsNavButton();
			await homePage
				.assertThat()
				.originalsGameInSubnavVisualCorrect(
					OriginalGame.Limbo,
					testInfo,
				);
		},
	);
});
