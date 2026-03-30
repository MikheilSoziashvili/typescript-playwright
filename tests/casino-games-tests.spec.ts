import { IE_PROXY_CREDENTIALS_2 } from "@constants/proxies";
import { testDetails } from "@core/helpers/test-details-helper";
import {
	setAuthenticationCookies,
	stripAuthFromExternalRequests,
} from "@core/utils/utils";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CasinoGameName, GameProviderCode } from "@enums/casino-game";
import { Currency } from "@enums/currencies";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { TestTag } from "@enums/test-tags";
import { TestUserRole } from "@enums/test-user-roles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { Unit } from "@enums/units";
import { ToggleOptions } from "@enums/visibility-options";
import { Wallet } from "@enums/wallets";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";
import { testData } from "test-data/test-data-manager";

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
			.withTags(JiraComponent.CASINO, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.withJiraBugTickets("11715")
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
		"[ENG-7244] Casino - Verify in-game balance reflects selected crypto wallet balance",
		testDetails()
			.withTags(JiraComponent.CASINO, TestTag.ACCEPTANCE)
			.withAuthor(JiraUser.ANGEL_PETROV)
			.withJiraBugTickets("11715")
			.apply(),
		async ({ casinoPage, bookOfPyramidsPage }) => {
			await casinoPage.authenticatedHeader.changeWallet(Wallet.BTC);
			await casinoPage
				.steps()
				.searchForGameAndOpen(CasinoGameName.BOOK_OF_PYRAMIDS);

			const headerBalance =
				await bookOfPyramidsPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalance = await bookOfPyramidsPage.getGameBalance();

			await bookOfPyramidsPage
				.assertThat()
				.verifyBalanceWithTolerance(gameBalance, headerBalance, 0.01);

			await bookOfPyramidsPage.steps().refreshUntilGameIsLoaded();

			const headerBalanceAfterRefresh =
				await bookOfPyramidsPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalanceAfterRefresh =
				await bookOfPyramidsPage.getGameBalance();

			await bookOfPyramidsPage
				.assertThat()
				.verifyBalanceWithTolerance(
					gameBalanceAfterRefresh,
					headerBalanceAfterRefresh,
					0.01,
				);

			await bookOfPyramidsPage.authenticatedHeader.changeWallet(
				Wallet.XRP,
			);

			const headerBalanceEth =
				await bookOfPyramidsPage.authenticatedHeader.getAccountBalanceInCasinoGame();
			const gameBalanceEth = await bookOfPyramidsPage.getGameBalance();

			await bookOfPyramidsPage
				.assertThat()
				.verifyBalanceWithTolerance(
					gameBalanceEth,
					headerBalanceEth,
					0.01,
				);
		},
	);
});

test.describe("Aggregator and Providers - Casino games tests", () => {
	test.beforeEach(async ({ casinoGamesAdminPage, browserSessionManager }) => {
		await browserSessionManager.loginAs(TestUserRole.SUPERADMIN, {
			reuseContext: true,
		});
		await casinoGamesAdminPage.navigate();
		await casinoGamesAdminPage
			.steps()
			.searchAndToggleOnOffCasinoGameForProviders(
				CasinoGameName.CASH_VAULT_I,
				[GameProviderCode.SOFTSWISS, GameProviderCode.ALEA],
				ToggleOptions.OFF,
			);
		await casinoGamesAdminPage
			.steps()
			.searchAndToggleOnOffCasinoGameForProviders(
				CasinoGameName.SWEET_BONANZA,
				[GameProviderCode.ALEA],
				ToggleOptions.OFF,
			);
	});

	testData()
		.fromDomain()
		.casinoGames.allGamesWithRoundOutcomes()
		.forEach((game) => {
			test(
				`[ENG-5015] Verify round closer logs for Aggregator: ${game.aggregator}, Provider: ${game.gameProvider}, Casino game: ${game.gameName}, Round outcome: ${game.roundOutcome}`,
				testDetails()
					.withTags(
						JiraComponent.ADMIN,
						JiraComponent.CASINO,
						JiraComponent.TRANSACTIONS,
						JiraComponent.USER_INFO, TestTag.ACCEPTANCE)
					.withAuthor(JiraUser.IVAYLO_STOYCHEV)
					.withJiraBugTickets("11715")
					.withTags(TestTag.PLATFORM_BUG)
					.apply(),
				async ({ browserSessionManager }) => {
					test.fixme(
						isScheduledRun,
						"Games can not be loaded. Temporary skipped until fixed by DevOps team",
					);
					test.slow();
					const superAdminWithProxySession =
						await browserSessionManager.loginAs(
							TestUserRole.SUPERADMIN,
							{
								reuseContext: true,
								proxyCredentials: IE_PROXY_CREDENTIALS_2,
							},
						);

					await stripAuthFromExternalRequests(
						superAdminWithProxySession.page,
					);

					await superAdminWithProxySession.pages.casinoPage.navigate();

					await superAdminWithProxySession.pages.casinoGamesPage
						.steps()
						.setupProviderAuthentication(game);

					await superAdminWithProxySession.pages.casinoPage
						.steps()
						.searchForGameAndOpenWithRetries(game.gameName);

					await superAdminWithProxySession.pages.casinoGamesPage
						.steps()
						.playCasinoGameRoundSuccessfully(game);

					await superAdminWithProxySession.pages.userInfoAdminPage
						.steps()
						.navigateAndShowUserDetails(
							superAdminWithProxySession.getAuthenticatedUser()
								.user.username,
						);

					await superAdminWithProxySession.pages.userInfoAdminPage.clickUserInfoTab(
						UserInfoTabs.Transactions,
					);
					await superAdminWithProxySession.pages.transactionsAdminPage
						.steps()
						.fetchStatsCalculationsData();

					await superAdminWithProxySession.pages.toast
						.assertThat()
						.toastMessageIs(
							ToastTitle.SUCCESS,
							ToastSubTitle.SUCCESSFULLY_FETCHED_TRANSACTIONS,
						);
					await superAdminWithProxySession.pages.transactionsAdminPage
						.assertThat()
						.lastTransactionContainsWinAndRoundClosed();
					await superAdminWithProxySession.pages.transactionsAdminPage
						.assertThat()
						.lastTransactionContainsGameCode(game.gameCode);
					await superAdminWithProxySession.pages.transactionsAdminPage
						.assertThat()
						.lastTransactionValueMatchesRoundOutcome(
							game.roundOutcome,
						);
					await superAdminWithProxySession.pages.transactionsAdminPage
						.assertThat()
						.rowBeforeLastContainsBetTransaction();
				},
			);
		});
});
