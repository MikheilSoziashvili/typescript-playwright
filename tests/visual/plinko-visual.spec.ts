import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { BrowserName } from "@enums/playwright/project-browser-names";
import { test } from "@fixtures/fixtures";
import { jiraIssueId } from "@core/utils/utils";

test.describe("Visual Tests - Plinko", () => {
	test.beforeEach(async ({}, testInfo) => {
		if (testInfo.project.name === BrowserName.FIREFOX) {
			testInfo.annotations.push({
				type: AnnotationType.PERFORMANCE,
				description: jiraIssueId(6628),
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
