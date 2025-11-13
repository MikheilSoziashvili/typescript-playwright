import { test } from "@fixtures/fixtures";
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraUser } from "@enums/jira/jira-users";
import { JiraComponent } from "@enums/jira/jira-components";
import { CasinoGameName } from "@enums/casino-game";
import {
	setAuthenticationCookies,
	stripAuthFromExternalRequests,
} from "@core/utils/utils";
import { Currency } from "@enums/currencies";
import { Wallet } from "@enums/wallets";
import { Unit } from "@enums/units";
test.use({ launchOptions: { slowMo: 1000 } });

test.describe("Casino games tests", () => {
	test.beforeEach(async ({ page, gamdomApiDbFacade, casinoPage }) => {
		await stripAuthFromExternalRequests(page);

		const { cookie } = await gamdomApiDbFacade.createUserWithWalletsAndAuth(
			{
				walletUnits: [Unit.BTC_SATOSHI, Unit.XRP_DROP],
				amount: 100000,
			},
		);
		await setAuthenticationCookies(page, cookie);
		await casinoPage.navigate();
	});

	test(
		"[ENG-2845][Casino] Search for any game and play",
		testDetails()
			.withTags(JiraComponent.CASINO)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({ casinoPage, bookOfPyramidsPage, userBalanceHandler }) => {
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
	test(
		"[ENG-7244]Casino - Verify in-game balance reflects selected crypto wallet balance",
		testDetails()
			.withTags(JiraComponent.CASINO)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.apply(),
		async ({ casinoPage, bubblesBonanzaPage }) => {
			await casinoPage.authenticatedHeader.changeWallet(Wallet.BTC);
			await casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.CASH_VAULT_I);

			const headerBalance =
				await bubblesBonanzaPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalance = await bubblesBonanzaPage.getGameBalance();

			await bubblesBonanzaPage
				.assertThat()
				.verifyBalanceWithTolerance(gameBalance, headerBalance, 0.01);

			await bubblesBonanzaPage.steps().refreshUntilGameIsLoaded();

			const headerBalanceAfterRefresh =
				await bubblesBonanzaPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalanceAfterRefresh =
				await bubblesBonanzaPage.getGameBalance();

			await bubblesBonanzaPage
				.assertThat()
				.verifyBalanceWithTolerance(
					gameBalanceAfterRefresh,
					headerBalanceAfterRefresh,
					0.01,
				);

			await bubblesBonanzaPage.authenticatedHeader.changeWallet(
				Wallet.XRP,
			);

			const headerBalanceEth =
				await bubblesBonanzaPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalanceEth = await bubblesBonanzaPage.getGameBalance();

			await bubblesBonanzaPage
				.assertThat()
				.verifyBalanceWithTolerance(
					gameBalanceEth,
					headerBalanceEth,
					0.01,
				);
		},
	);
});
