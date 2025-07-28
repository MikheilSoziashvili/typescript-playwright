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
import { RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { OriginalGame } from "@enums/original-games";
import { Unit } from "@enums/units";
import { UserMenuOption } from "@enums/user-menu-options";
import { WalletType } from "@enums/wallet-types";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";

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
			const newUserData = new RegisterTestData();

			//TODO - Remove this when the issue with the user balance is fixed - the last assertion needs to be updated and not use the tolerance!!

			test.describe("[ENG-5415] Place bets across multiple wallets", () => {
				const plinkoWalletBetDataset = parse_csv(
					DATASETS_DIR,
					CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS,
				) as {
					Wallet: string;
					BetCurrency: string;
					BetAmount: number;
				}[];

				let newUserCookie: string;

				test.beforeAll(async ({ gamdomDb, gamdomApi }) => {
					await gamdomDb.createNewUser({
						username: newUserData.username,
						password: newUserData.password,
						email: newUserData.email,
					});

					const userId = (
						await gamdomApi.getBasicInfo(
							newUserData.username,
							newUserData.password,
						)
					).user.id;

					await Promise.all(
						walletUnits.map((unit) =>
							gamdomDb.upsertUserWallet(
								userId,
								unit,
								SUPER_HIGH_USER_AMOUNT,
							),
						),
					);

					newUserCookie =
						await gamdomApi.authenticateWithExistingUser(
							newUserData.username,
							newUserData.password,
						);
				});

				plinkoWalletBetDataset.forEach((record) => {
					test(`Place bet using ${record.Wallet} and verify display in ${record.BetCurrency}`, async ({
						plinkoGamePage,
						homePage,
						userBalanceHandler,
						page,
					}) => {
						await setAuthenticationCookies(page, newUserCookie);

						await plinkoGamePage.navigate();

						const headers = {
							Cookie: await encodeCookieHeader(newUserCookie),
						};

						await homePage.authenticatedHeader.changeWalletAndCurrency(
							record.Wallet,
							record.BetCurrency,
						);

						await plinkoGamePage.startManualBet(
							record.BetAmount.toString(),
						);
						logger.info(
							`Bet amount placed: ${record.BetAmount} ${record.BetCurrency}`,
						);
						await plinkoGamePage.steps().waitForSlidersToBeActive();

						const betWinMultiplier = await plinkoGamePage
							.steps()
							.getInGameChipsHistoryButtonValue();
						logger.info(`Bet win multiplier: ${betWinMultiplier}`);

						const winnings = await plinkoGamePage
							.steps()
							.calculateWinnings(
								record.BetAmount,
								betWinMultiplier,
							);
						logger.info(`Winnings calculated: ${winnings}`);

						const expectedBalanceAfterBet = await plinkoGamePage
							.steps()
							.calculateExpectedBalance(
								await userBalanceHandler.walletBalanceInCurrencyAsCoins(
									toWalletUnit(record.Wallet),
									toCurrencyEnum(record.BetCurrency),
									WalletType.DEFAULT,
									headers,
								),
								record.BetAmount,
								winnings,
							);
						logger.info(
							`Expected balance after bet: ${expectedBalanceAfterBet}`,
						);

						const backendCoinsAfterBet =
							await userBalanceHandler.walletBalanceInCoins(
								toWalletUnit(record.Wallet),
								WalletType.DEFAULT,
								headers,
							);
						logger.info(
							`Backend coins after bet: ${backendCoinsAfterBet}`,
						);

						await plinkoGamePage
							.assertThat()
							.verifyBalanceWithTolerance(
								backendCoinsAfterBet,
								expectedBalanceAfterBet,
								1100,
							);
					});
				});
			});
		});
	},
);
