import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { OriginalGame } from "@enums/original-games";
import { TestTag } from "@enums/test-tags";
import { test } from "@fixtures/fixtures";

test.describe("Visual Tests - Originals - How to Play", () => {
	const gamesToTest = [
		OriginalGame.Keno,
		OriginalGame.Mines,
		OriginalGame.Plinko,
	];

	for (const game of gamesToTest) {
		test(
			`[ENG-6737] Originals - How to Play modal is correct for ${game}`,
			testDetails()
				.withTags(
					TestTag.VISUAL,
					JiraComponent.SOK_GAMES,
					JiraComponent[
						game.toUpperCase() as keyof typeof JiraComponent
					],
				)
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ originalsPage }, testInfo) => {
				await originalsPage.navigateToGame(game);
				await originalsPage.openHowToPlayModal();
				await originalsPage
					.steps()
					.verifyHowToPlayModalAndItsSteps(game, testInfo);
			},
		);
	}
});
