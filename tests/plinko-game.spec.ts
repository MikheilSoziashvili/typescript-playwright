import { testDetails } from "@core/helpers/test-details-helper";
import { getCookieHeader, setAuthenticationCookies } from "@core/utils/utils";
import { PlinkoBetTestData, RegisterTestData } from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { Feature } from "@enums/feature";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { Currency } from "@enums/currencies";
import { LogType } from "@enums/log-types";
import { OriginalGame } from "@enums/original-games";
import { TestTag } from "@enums/test-tags";
import { Unit } from "@enums/units";
import { UserMenuOption } from "@enums/user-menu-options";
import { UserType } from "@enums/user-types";
import { storageStateNewSuperAdminUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { logger } from "@logger/logger";
import { SUPER_HIGH_USER_AMOUNT } from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";
import { TestUserRole } from "@enums/test-user-roles";

const walletUnits = Object.values(Unit);

test.describe(
	"Plinko tests",
	testDetails()
		.withTags(JiraComponent.SOK_GAMES, JiraComponent.PLINKO)
		.apply(),
	() => {
		test.describe("Plinko Sign-In feature tests", () => {
			testData()
				.fromCsvRaw({ file: CsvFilesName.LOGIN_SUCCESSFUL })
				.forEach((record) => {
					test(
						`[ENG-5128] Sign In feature on Plinko - Login successful: [Username: ${record.username}] [Password: ${record.password}]`,
						testDetails()
							.withTags(TestTag.SMOKE, TestTag.ORIGINALS)
							.withAuthor(JiraUser.RALUCA_ARITON)
							.apply(),
						async ({ plinkoGamePage, loginModal }) => {
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
						},
					);
				});
		});
	},
);

test.describe(
	"Plinko game tests",
	testDetails()
		.withTags(JiraComponent.SOK_GAMES, JiraComponent.PLINKO)
		.apply(),
	() => {
		test.slow();

		testData()
			.fromCsvParsed({
				file: CsvFilesName.PLINKO_TEST_DATA,
			})
			.forEach((record) => {
				test(
					`[ENG-2844] Plinko - Play a game and try to win - Bet: ${record.betAmount}, Rows: ${record.rowsValue}, Risk: ${record.riskValue}`,
					testDetails()
						.withAuthor(JiraUser.NIKOLAY_GENOV)
						.withTags(TestTag.ORIGINALS)
						.apply(),
					async ({ plinkoGamePage, gamdomApiDbFacade }) => {
						const { cookie } =
							await gamdomApiDbFacade.createSingleUserDbAndAuth();
						await setAuthenticationCookies(
							plinkoGamePage.page,
							cookie,
						);
						const plinkoBetData = new PlinkoBetTestData({
							betAmount: record.betAmount,
						});

						await plinkoGamePage.navigateAndWaitForGameToLoad();

						await plinkoGamePage
							.steps()
							.playPlinkoUntilWin(plinkoBetData.betAmount, {
								rowsValue: record.rowsValue,
								riskValue: record.riskValue,
							});
					},
				);
			});

		test(
			"[ENG-5164] Verify Plinko is displayed in statistics and in the Last 24 Hours Stats",
			testDetails()
				.withAuthor(JiraUser.RALUCA_ARITON)
				.withTags(TestTag.ORIGINALS)
				.apply(),
			async ({
				plinkoGamePage,
				homePage,
				statisticsPage,
				gamdomApiDbFacade,
				testDataObject,
			}) => {
				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(plinkoGamePage.page, cookie);

				const betTestData = testDataObject.bet.build(
					{ username: user.username },
					{ betAmount: 100 },
				);

				await plinkoGamePage.navigate();
				await plinkoGamePage.startManualBet(
					betTestData.betAmount.toString(),
				);
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
						betTestData.betAmount,
					);
			},
		);

		test.describe("Plinko posible win pop-up", () => {
			testData()
				.fromCsvRaw({ file: CsvFilesName.POSSIBLE_WIN_POP_UP })
				.forEach(({ currency }) => {
					test(
						`[ENG-5685] Possible win pop-up for ${currency} appears while hovering over all baskets`,
						testDetails()
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ORIGINALS)
							.apply(),
						async ({
							browserSessionManager,
							plinkoGamePage,
							homePage,
						}) => {
							await browserSessionManager.loginAs(
								TestUserRole.REGULAR,
								{
									reuseContext: true,
								},
							);
							await plinkoGamePage.navigate();
							await homePage.authenticatedHeader.changeCurrency(
								currency,
							);
							await plinkoGamePage
								.assertThat()
								.betAmountCurrencyChanged(currency as Currency);

							const coefficients =
								await plinkoGamePage.map.plinkoCoefficientButtons.all();

							for (const coefficient of coefficients) {
								await plinkoGamePage.getProfitOnWinAmount(
									coefficient,
								);
								await plinkoGamePage
									.assertThat()
									.verifyProfitOnWinAmountIsCorrect(
										coefficient,
									);
							}
						},
					);
				});
		});
	},
);

test.describe(
	"Plinko game - User Balance tests",
	testDetails()
		.withTags(JiraComponent.SOK_GAMES, JiraComponent.PLINKO)
		.apply(),
	() => {
		test.slow();

		test.describe("[ENG-5415] Place bets across multiple wallets", () => {
			testData()
				.fromCsvParsed({
					file: CsvFilesName.PLINKO_BETS_ACROSS_MULTIPLE_WALLETS,
				})
				.forEach((record) => {
					test(
						`Place bet using ${record.Wallet} and verify display in ${record.BetCurrency}`,
						testDetails()
							.withJiraBugTickets("8564")
							.withAuthor(JiraUser.RALUCA_ARITON)
							.withTags(TestTag.ORIGINALS)
							.apply(),
						async ({ plinkoBetTestFlow }) => {
							await plinkoBetTestFlow.placeBetAcrossWallets({
								wallet: record.Wallet,
								betCurrency: record.BetCurrency,
								betAmount: record.BetAmount,
								walletUnits: walletUnits,
								initialAmount: SUPER_HIGH_USER_AMOUNT,
							});
						},
					);
				});
		});
	},
);

test.describe(
	"Plinko transactions",
	testDetails()
		.withTags(JiraComponent.SOK_GAMES, JiraComponent.PLINKO)
		.apply(),
	() => {
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
			testDetails()
				.withTags(JiraComponent.TRANSACTIONS)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
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
					`Balances array after playing: ${JSON.stringify(balances)}`,
				);

				const totalWagered = await plinkoGamePage
					.steps()
					.calculateTotalWagered(
						plinkoBetData.betAmount,
						numberOfGames,
					);

				await userInfoAdminPage
					.steps()
					.navigateAndShowUserDetails(superAdminData.username);
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
	},
);

test.describe.serial(
	"Plinko - feature",
	testDetails().withTags(TestTag.SEQUENTIAL).apply(),
	() => {
		let superAdminCookie: string;

		test.beforeEach(async ({ gamdomApiDbFacade, gamdomApi, page }) => {
			const { cookie } =
				await gamdomApiDbFacade.createSuperAdminUserDbAndAuth();
			superAdminCookie = getCookieHeader(cookie);

			await setAuthenticationCookies(page, cookie);

			await gamdomApi.setFeatureState(
				Feature.MINES,
				{
					[UserType.REGULAR]: false,
					[UserType.QA_USER]: false,
				},
				{ Cookie: superAdminCookie },
			);
		});

		test(
			"[ENG-5528] Plinko game can be launched when Mines is unavailable",
			testDetails()
				.withTags(TestTag.ORIGINALS, JiraComponent.PLINKO)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({ minesGamePage, plinkoGamePage }) => {
				await minesGamePage.navigate();
				await minesGamePage.assertThat().minesIsDisabled();

				await plinkoGamePage.navigateAndWaitForGameToLoad();
				await plinkoGamePage.assertThat().dropBallButtonIsDisplayed();
			},
		);

		test.afterAll(async ({ gamdomApi }) => {
			await gamdomApi.setFeatureState(
				Feature.MINES,
				{
					[UserType.REGULAR]: true,
					[UserType.QA_USER]: true,
				},
				{ Cookie: superAdminCookie },
			);
		});
	},
);
