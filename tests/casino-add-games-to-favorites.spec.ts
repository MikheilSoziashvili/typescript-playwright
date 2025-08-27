import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { OriginalGame } from "@enums/original-games";
import { CasinoGameName } from "@enums/casino-game";
import { JiraUser } from "@enums/jira/jira-users";

test.describe(
	"Casino tests",
	testDetails().withTags(JiraComponent.CASINO).apply(),
	() => {
		test.use(storageStateNewUserDB());
		test(
			"[ENG-2849] Casino - Favorite tab - add games from page to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ casinoPage }) => {
				await casinoPage.navigate();

				const gameName = await casinoPage.getFirstNewGameName();
				await casinoPage.addFirstNewGameToFavorites();
				await casinoPage
					.steps()
					.openFavoritesAndCheckIfGameHasBeenAdded(gameName);
			},
		);

		test(
			"[ENG-2849] Casino - Favorite tab - add games from dropdown to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ casinoPage }) => {
				await casinoPage.navigate();

				await casinoPage.searchForGame(OriginalGame.Dice);
				await casinoPage.addGameFromDropdownToFavorites(
					OriginalGame.Dice,
				);
				await casinoPage
					.steps()
					.openFavoritesAndCheckIfGameHasBeenAdded(OriginalGame.Dice);
			},
		);

		test(
			"[ENG-2849] Casino - Favorite tab - open a game and add to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
			async ({ casinoPage }) => {
				await casinoPage.navigate();

				await casinoPage.searchForGame(CasinoGameName.BARREL_BONANZA);
				await casinoPage.openGameFromDropdown(
					CasinoGameName.BARREL_BONANZA,
				);
				await casinoPage.clickInGameHeartIcon();

				await casinoPage.navigate();
				await casinoPage
					.steps()
					.openFavoritesAndCheckIfGameHasBeenAdded(
						CasinoGameName.BARREL_BONANZA,
					);
			},
		);
	},
);
