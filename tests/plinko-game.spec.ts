import { DATASETS_DIR } from "@constants/file-paths";
import {
	toCurrencyEnum,
	toWalletUnit,
} from "@core/utils/currency-wallet-utils";
import {
	encodeCookieHeader,
	parse_csv,
	setAuthenticationCookies,
} from "@core/utils/utils";
import { PlinkoBetTestData, RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { LogType } from "@enums/log-types";
import { OriginalGame } from "@enums/original-games";
import { Unit } from "@enums/units";
import { UserMenuOption } from "@enums/user-menu-options";
import { WalletType } from "@enums/wallet-types";
import {
	storageStateNewSuperAdminUserDB,
	storageStateNewUserDB,
} from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";

const walletUnits = Object.values(Unit);

test.describe(
	"Plinko tests",
	{ tag: ["@originals", "@plinko", "@sok-games"] },
	() => {
		test.describe("Plinko Sign-In feature tests", () => {
			test.beforeEach(async ({}) => {
				for (const record of parse_csv(
					DATASETS_DIR,
					CsvFilesName.LOGIN_SUCCESSFUL,
				) as {
					username: string;
					password: string;
				}[]) {
					test(`[ENG-5128] Sign In feature on Plinko - Login successful: [Username: ${record.username}] [Password: ${record.password}] @smoke @originals`, async ({
						plinkoGamePage,
						loginModal,
					}) => {
						await plinkoGamePage.navigate();
						await plinkoGamePage
							.assertThat()
							.signInButtonIsDisplayed();
						await plinkoGamePage.openLoginModal();
						await loginModal.login(
							record.username,
							record.password,
						);
						await plinkoGamePage
							.assertThat()
							.dropBallButtonIsDisplayed();
					});
				}
			});
		});

		test.describe("Plinko game tests", () => {
			test.use(storageStateNewUserDB());
			test.slow();

			test("[ENG-5164] Verify Plinko is displayed in statistics and in the Last 24 Hours Stats", async ({
				plinkoGamePage,
				homePage,
				statisticsPage,
			}) => {
				const betAmount = 100;
				await plinkoGamePage.navigate();
				await plinkoGamePage.startManualBet(betAmount.toString());
				await plinkoGamePage.steps().waitForSlidersToBeActive();
				const betWinMultiplier = await plinkoGamePage
					.steps()
					.getInGameChipsHistoryButtonValue();
				await homePage.authenticatedHeader.navigateToUserMenuOption(
					UserMenuOption.STATISTICS,
				);

				await statisticsPage
					.assertThat()
					.last24HoursGameLargestProfitIs(
						OriginalGame.Plinko,
						betWinMultiplier,
						betAmount,
					);
			});
		});

		test.describe("Plinko game - User Balance tests", () => {
			test.slow();

			test.describe("[ENG-5415] Place bets across multiple wallets", () => {
				testData()
					.fromCsvParsed({
						file: CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS,
					})
					.forEach((record) => {
						test(`Place bet using ${record.Wallet} and verify display in ${record.BetCurrency}`, async ({
							gamdomApiDbFacade,
							plinkoGamePage,
							homePage,
							userBalanceHandler,
							page,
						}) => {
							const { cookie } =
								await gamdomApiDbFacade.createUserWithWalletsAndAuth(
									{
										walletUnits: walletUnits,
										amount: SUPER_HIGH_USER_AMOUNT,
									},
								);

							await setAuthenticationCookies(page, cookie);

							await plinkoGamePage.navigate();

							const headers = {
								Cookie: await encodeCookieHeader(cookie),
							};

							await homePage.authenticatedHeader.changeWalletAndCurrency(
								record.Wallet,
								record.BetCurrency,
							);

							const walletUnit = toWalletUnit(record.Wallet);
							const betCurrency = toCurrencyEnum(
								record.BetCurrency,
							);

							await plinkoGamePage
								.assertThat()
								.betAmountCurrencyChanged(betCurrency);

							const coinsBefore =
								await userBalanceHandler.walletBalanceInCoins(
									walletUnit,
									WalletType.DEFAULT,
									headers,
								);

							await plinkoGamePage.startManualBet(
								record.BetAmount.toString(),
							);

							await plinkoGamePage
								.steps()
								.waitForSlidersToBeActive();

							const betWinMultiplier = await plinkoGamePage
								.steps()
								.getInGameChipsHistoryButtonValue();

							const stakeCoins =
								await userBalanceHandler.convertDisplayCurrencyToCoins(
									Number(record.BetAmount),
									betCurrency,
									headers,
								);

							const payoutCoins =
								userBalanceHandler.calculatePayoutCoins(
									stakeCoins,
									betWinMultiplier,
								);

							const expectedCoinsAfter = await plinkoGamePage
								.steps()
								.calculateExpectedBalance(
									coinsBefore,
									stakeCoins,
									payoutCoins,
								);

							const coinsAfter =
								await userBalanceHandler.walletBalanceInCoins(
									walletUnit,
									WalletType.DEFAULT,
									headers,
								);

							await plinkoGamePage
								.assertThat()
								.verifyBalanceWithTolerance(
									coinsAfter,
									expectedCoinsAfter,
								);
						});
					});
			});
		});

		test.describe("Plinko transactions", () => {
			const superAdminData = new RegisterTestData({
				useGamdomEmailDomain: true,
			});
			test.use(
				storageStateNewSuperAdminUserDB({
					username: superAdminData.username,
					password: superAdminData.password,
				}),
			);

			test(
				"[ENG-5472] Verify Plinko is displayed in transactions tab",
				{ tag: "@transactions" },
				async ({
					plinkoGamePage,
					userInfoAdminPage,
					transactionsAdminPage,
				}) => {
					const plinkoBetData = new PlinkoBetTestData({
						betAmount: 10,
					});
					const numberOfGames = 5;
					await plinkoGamePage.navigate();

					const balances = await plinkoGamePage
						.steps()
						.playMultipleGamesAndGetBalances(
							plinkoBetData.betAmount,
							numberOfGames,
						);

					logger.info(
						`Balances array after playing: ${JSON.stringify(
							balances,
						)}`,
					);

					const totalWagered = `$${(
						plinkoBetData.betAmount * numberOfGames
					).toFixed(2)}`;
					logger.info(`Total wagered in Plinko: ${totalWagered}`);

					await userInfoAdminPage.navigate();
					await userInfoAdminPage
						.steps()
						.showUserDetails(superAdminData.username);
					await transactionsAdminPage.navigateToAdminUserTransactionsPage();
					await transactionsAdminPage.checkStatsCalculationBox();

					await transactionsAdminPage
						.steps()
						.selectLogTypesOnly([LogType.BET, LogType.BET_WIN]);

					await transactionsAdminPage.clickFetchData();

					await transactionsAdminPage
						.assertThat()
						.verifyLogsTableBalanceAfterColumnValues(balances);
					await transactionsAdminPage
						.assertThat()
						.verifyPlinkoTotalWagered(totalWagered);
				},
			);
		});
	},
);
