import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { CasinoGameName } from "@enums/casino-game";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { CasinoGameCode } from "@enums/casino-game-code";

test.describe(
	"Casino tests",
	testDetails().withTags(JiraComponent.CASINO).apply(),
	() => {
		test.use(storageStateNewUserDB());
		test(
			"[ENG-2849] Casino - Favorite tab - add games from page to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ casinoPage, favoritesGamesListListener }) => {
				await casinoPage.navigate();

				const gameName = await casinoPage.getFirstNewGameName();
				await casinoPage.addFirstNewGameToFavorites();
				favoritesGamesListListener.startListening();

				await casinoPage.openFavoritesTab();

				const favoritesGamesList =
					await favoritesGamesListListener.getLastFavoritesGamesList();

				await casinoPage
					.assertThat()
					.favoritesGamesListContainsGame(
						favoritesGamesList,
						gameName,
					);
			},
		);

		test(
			"[ENG-2849] Casino - Favorite tab - add games from dropdown to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({
				casinoPage,
				favoritesGamesListListener,
				casinoGamesSearchListener,
			}) => {
				await casinoPage.navigate();

				casinoGamesSearchListener.startListening();

				await casinoPage.searchForGame(CasinoGameName.BOOK_OF_ARABIA);

				const searchGameResponse =
					await casinoGamesSearchListener.getLastCasinoGamesSearch();

				const gameIndex = casinoGamesSearchListener.getGameIndex(
					searchGameResponse,
					CasinoGameCode.BOOK_OF_ARABIA,
				);

				await casinoPage.addGameFromDropdownToFavorites(gameIndex);

				favoritesGamesListListener.startListening();

				await casinoPage.openFavoritesTab();

				const favoritesGamesList =
					await favoritesGamesListListener.getLastFavoritesGamesList();

				await casinoPage
					.assertThat()
					.favoritesGamesListContainsGame(
						favoritesGamesList,
						CasinoGameName.BOOK_OF_ARABIA,
					);
			},
		);

		test(
			"[ENG-2849] Casino - Favorite tab - open a game and add to favorites",
			testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).withTags(TestTag.ACCEPTANCE).apply(),
			async ({ casinoPage, favoritesGamesListListener }) => {
				await casinoPage.navigate();

				await casinoPage
					.steps()
					.searchForGameAndOpen(CasinoGameName.BARREL_BONANZA);
				await casinoPage.clickInGameHeartIcon();

				await casinoPage.navigate();

				favoritesGamesListListener.startListening();

				await casinoPage.openFavoritesTab();

				const favoritesGamesList =
					await favoritesGamesListListener.getLastFavoritesGamesList();

				await casinoPage
					.assertThat()
					.favoritesGamesListContainsGame(
						favoritesGamesList,
						CasinoGameName.BARREL_BONANZA,
					);
			},
		);
	},
);
