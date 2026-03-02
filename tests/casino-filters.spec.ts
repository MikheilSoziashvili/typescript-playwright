import { testDetails } from "@core/helpers/test-details-helper";
import { setAuthenticationCookies } from "@core/utils/utils";
import { GameProvider } from "@enums/game-providers";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
import { TestTag } from "@enums/test-tags";

test.describe(
	"Casino filters tests",
	testDetails().withTags(JiraComponent.CASINO).apply(),
	() => {
		test(
			"[ENG-2846] Pick random filter",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ casinoPage, gamdomApiDbFacade, page }) => {
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);

				await casinoPage.navigate();

				await casinoPage.steps().configureRandomGameSettings({
					providers: [
						GameProvider.PRAGMATIC_PLAY,
						GameProvider.WICKED_GAMES,
					],
					showOnlyBonusBuy: false,
					disableLiveGames: true,
					disableTableGames: true,
				});

				await casinoPage.clickPickRandomButton();

				await casinoPage
					.assertThat()
					.verifyGameProviderIsOneOf([
						GameProvider.PRAGMATIC_PLAY,
						GameProvider.WICKED_GAMES,
					]);
			},
		);
	},
);
