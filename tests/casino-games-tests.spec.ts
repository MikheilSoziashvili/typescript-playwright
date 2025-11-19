import { testDetails } from "@core/helpers/test-details-helper";
import {
	setAuthenticationCookies,
	stripAuthFromExternalRequests,
} from "@core/utils/utils";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CasinoGameName } from "@enums/casino-game";
import { Currency } from "@enums/currencies";
import { CsvFilesName } from "@enums/csv-file-name";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import { Wallet } from "@enums/wallets";
import { test } from "@fixtures/fixtures";
import { testData } from "test-data/test-data-manager";
import { TestUserRole } from "@enums/test-user-roles";

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

	test.describe("Aggregator and Providers - Casino games tests", () => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.CASINO_GAMES_AGGREGATOR_PROVIDER,
			})
			.forEach((game) => {
				test(
					`[ENG-5015] Verify round closer logs for Aggregator: ${game.aggregator}, Provider: ${game.gameProvider}, Casino game: ${game.gameName}`,
					testDetails()
						.withTags(
							JiraComponent.ADMIN,
							JiraComponent.CASINO,
							JiraComponent.TRANSACTIONS,
							JiraComponent.USER_INFO,
						)
						.withAuthor(JiraUser.IVAYLO_STOYCHEV)
						.apply(),
					async ({
						casinoPage,
						casinoGamesPage,
						userInfoAdminPage,
						transactionsAdminPage,
						browserSessionManager,
						toast,
					}) => {
						const superAdminSession =
							await browserSessionManager.loginAs(
								TestUserRole.SUPERADMIN,
								{ reuseContext: true },
							);

						await casinoGamesPage
							.steps()
							.setupProviderAuthentication(game);

						await casinoPage
							.steps()
							.searchForGameAndOpen(game.gameName);

						await casinoGamesPage
							.steps()
							.playCasinoGameRoundSuccessfully(game);

						await userInfoAdminPage
							.steps()
							.navigateAndShowUserDetails(
								superAdminSession.getAuthenticatedUser().user
									.username,
							);

						await userInfoAdminPage.clickUserInfoTab(
							UserInfoTabs.Transactions,
						);
						await transactionsAdminPage
							.steps()
							.fetchStatsCalculationsData();

						await toast
							.assertThat()
							.toastMessageIs(
								ToastTitle.SUCCESS,
								ToastSubTitle.SUCCESSFULLY_FETCHED_TRANSACTIONS,
							);
						await transactionsAdminPage
							.assertThat()
							.lastTransactionContainsWinAndRoundClosed();
						await transactionsAdminPage
							.assertThat()
							.lastTransactionContainsGameCode(game.gameCode);
					},
				);
			});
	});
});
