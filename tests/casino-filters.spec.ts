import { testDetails } from "@core/helpers/test-details-helper";
import { GameProvider } from "@enums/game-providers";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";

test.describe(
	"Casino filters tests",
	testDetails().withTags(JiraComponent.CASINO).apply(),
	() => {
		test(
			"[ENG-2850] Filter by provider",
			testDetails().withAuthor(JiraUser.RALUCA_ARITON).apply(),
			async ({ casinoPage }) => {
				await casinoPage.navigate();
				const providersToSelect = [
					GameProvider.PRAGMATIC_PLAY,
					GameProvider.WICKED_GAMES,
				];
				await casinoPage
					.steps()
					.selectMultipleProvidersFromDropdown(providersToSelect);

				await casinoPage
					.assertThat()
					.verifyAllVisibleGamesAreFromProvider(providersToSelect);

				await casinoPage
					.steps()
					.deselectProviderFromDropdown(GameProvider.PRAGMATIC_PLAY);

				await casinoPage
					.steps()
					.selectProviderFromDropdown(GameProvider.AVATARUX);

				await casinoPage
					.assertThat()
					.verifyAllVisibleGamesAreFromProvider([
						GameProvider.HACKSAW_GAMING,
						GameProvider.AVATARUX,
					]);
			},
		);
	},
);
