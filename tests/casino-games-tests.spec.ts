import { test } from "@fixtures/fixtures";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { CasinoGameName } from "@enums/casino-game";
import { stripAuthFromExternalRequests } from "@core/utils/utils";
import { Currency } from "@enums/currencies";

test.describe("Casino games tests", () => {
	test.beforeEach(async ({ page }) => {
		await stripAuthFromExternalRequests(page);
	});

	test.use(storageStateNewUserDB());

	test(
		"[ENG-2845][Casino] Search for any game and play",
		testDetails()
			.withTags(JiraComponent.CASINO)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({ casinoPage, bookOfPyramidsPage, userBalanceHandler }) => {
			await casinoPage.navigate();

			await casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.BOOK_OF_PYRAMIDS);

			const accountBalanceBeforeBet =
				await userBalanceHandler.walletBalanceInCoins();

			await bookOfPyramidsPage.clickMaxBet();
			const betAmount = await bookOfPyramidsPage.getBetAmount();

			const { won, amount } = await bookOfPyramidsPage
				.steps()
				.spinOnceAndGetResult();

			const accountBalanceAfterBet =
				await userBalanceHandler.walletBalanceInCoins();

			const betCoins =
				await userBalanceHandler.convertDisplayCurrencyToCoins(
					betAmount,
					Currency.USD,
				);
			const winCoins =
				await userBalanceHandler.convertDisplayCurrencyToCoins(
					amount,
					Currency.USD,
				);

			await bookOfPyramidsPage
				.assertThat()
				.balanceAfterBetIsCorrect(
					accountBalanceBeforeBet,
					accountBalanceAfterBet,
					betCoins,
					won,
					winCoins,
				);
		},
	);
});
