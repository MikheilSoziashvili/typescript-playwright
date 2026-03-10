import { DATASETS_DIR } from "@constants/file-paths";
import { testDetails } from "@core/helpers/test-details-helper";

import {
	parse_csv,
	roundToDecimals,
	setAuthenticationCookies,
} from "@core/utils/utils";
import {
	NegativeBetValidationScenario,
	QuickSelectScenario,
	RawNegativeBetValidationScenario,
} from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import { Currency } from "@enums/currencies";
import { Delay } from "@enums/delay";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import {
	OriginalGame,
	OriginalsQuickSelectButtons,
} from "@enums/original-games";
import { Unit } from "@enums/units";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { isScheduledRun } from "configuration";
import {
	HIGH_USER_AMOUNT,
	SUPER_HIGH_USER_AMOUNT,
} from "database/constants/user-amounts";
import { testData } from "test-data/test-data-manager";

test.describe("Quick Select Buttons", () => {
	test.use(storageStateNewUserDB());

	const quickSelectScenarios: QuickSelectScenario[] =
		testData().fromCsvParsed({
			file: CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS,
		});

	const minScenario = quickSelectScenarios.filter(
		(scenario) => scenario.buttonType === OriginalsQuickSelectButtons.MIN,
	);

	const halfScenario = quickSelectScenarios.filter(
		(scenario) => scenario.buttonType === OriginalsQuickSelectButtons.HALF,
	);

	const maxScenario = quickSelectScenarios.filter(
		(scenario) => scenario.buttonType === OriginalsQuickSelectButtons.MAX,
	);

	const doubleScenario = quickSelectScenarios.filter(
		(scenario) =>
			scenario.buttonType === OriginalsQuickSelectButtons.DOUBLE,
	);

	test.describe("MIN button", () => {
		for (const {
			game,
			initialBetAmount,
			currency: betCurrency,
			minOrMaxAmount: minAmount,
		} of minScenario) {
			test(
				`[ENG-5455] should set min amount for ${game} and ${betCurrency}`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent[
							game.toUpperCase() as keyof typeof JiraComponent
						],
					)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage.authenticatedHeader.changeCurrency(
						betCurrency,
					);
					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);
					await originalsPage.steps().pressMinButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, minAmount);
					await originalsPage.steps().pressMinButton(game);
					await originalsPage.steps().pressHalfButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, minAmount);
				},
			);
		}
	});

	test.describe("HALF button", () => {
		for (const {
			game,
			initialBetAmount,
			currency: betCurrency,
			minOrMaxAmount: minAmount,
			expectedAfterFirstClick,
			expectedAfterSecondClick,
		} of halfScenario) {
			test(
				`[ENG-5454] should halve bet for ${game} and ${betCurrency} with initial bet ${initialBetAmount}`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent[
							game.toUpperCase() as keyof typeof JiraComponent
						],
					)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage.authenticatedHeader.changeCurrency(
						betCurrency,
					);
					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);

					await originalsPage.steps().pressHalfButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(
							game,
							roundToDecimals(expectedAfterFirstClick, 2),
						);

					await originalsPage.steps().pressHalfButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(
							game,
							roundToDecimals(expectedAfterSecondClick, 2),
						);

					await originalsPage.steps().pressHalfButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, minAmount);
				},
			);
		}
	});

	test.describe("MAX button", () => {
		test.use(storageStateNewUserDB({ amount: HIGH_USER_AMOUNT }));

		for (const {
			game,
			initialBetAmount,
			currency: betCurrency,
			minOrMaxAmount: maxAmount,
		} of maxScenario) {
			test(
				`[ENG-5053] should set max amount for ${game} and ${betCurrency}`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent[
							game.toUpperCase() as keyof typeof JiraComponent
						],
					)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage.authenticatedHeader.changeCurrency(
						betCurrency,
					);
					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);
					await originalsPage.steps().pressMaxButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, maxAmount);
					await originalsPage.steps().pressMaxButton(game);
					await originalsPage.steps().pressDoubleButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, maxAmount);
				},
			);
		}
	});

	test.describe("DOUBLE button", () => {
		test.use(storageStateNewUserDB({ amount: HIGH_USER_AMOUNT }));

		for (const {
			game,
			initialBetAmount,
			currency: betCurrency,
			minOrMaxAmount: maxAmount,
			expectedAfterFirstClick,
			expectedAfterSecondClick,
		} of doubleScenario) {
			test(
				`[ENG-5456] should double bet for ${game} and ${betCurrency} with initial bet ${initialBetAmount}`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent[
							game.toUpperCase() as keyof typeof JiraComponent
						],
					)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage.authenticatedHeader.changeCurrency(
						betCurrency,
					);

					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);

					await originalsPage.steps().pressDoubleButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(
							game,
							roundToDecimals(expectedAfterFirstClick, 2),
						);

					await originalsPage.steps().pressDoubleButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(
							game,
							roundToDecimals(expectedAfterSecondClick, 2),
						);

					await originalsPage.steps().pressDoubleButton(game);
					await originalsPage
						.assertThat()
						.betAmountIsCorrect(game, maxAmount);
				},
			);
		}
	});

	test.describe("Negative Bet Amount Validation", () => {
		test.use(storageStateNewUserDB());

		const negativeBetRawRows = parse_csv(
			DATASETS_DIR,
			CsvFilesName.ORIGINALS_NEGATIVE_BET_VALIDATION,
		) as RawNegativeBetValidationScenario[];

		const negativeBetScenarios: NegativeBetValidationScenario[] =
			negativeBetRawRows.map((raw) => ({
				game: OriginalGame[raw.game as keyof typeof OriginalGame],
				negativeBetAmount: parseFloat(raw.negativeBetAmount),
				expectedBetAmount: parseFloat(raw.expectedBetAmount),
			}));

		for (const {
			game,
			negativeBetAmount,
			expectedBetAmount,
		} of negativeBetScenarios) {
			test(
				`[ENG-6968] should not accept negative bet amount ${negativeBetAmount} for ${game}`,
				testDetails()
					.withTags(
						JiraComponent.GAMDOM_ORIGINALS,
						JiraComponent[
							game.toUpperCase() as keyof typeof JiraComponent
						],
					)
					.withAuthor(JiraUser.RALUCA_ARITON)
					.apply(),
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();

					await originalsPage
						.steps()
						.setBetAmount(game, negativeBetAmount);

					await originalsPage
						.assertThat()
						.betAmountRemainsUnchangedAfterNegativeInput(
							game,
							expectedBetAmount,
						);
				},
			);
		}
	});
});

test.describe("Live Bets Section", () => {
	const gamesToTest = Object.values(OriginalGame).filter(
		(game) => game !== OriginalGame.Roulette,
	);

	test.fixme(isScheduledRun);
	for (const game of gamesToTest) {
		test(
			`[ENG-3157] Bets are displayed in the Live bets section for ${game}`,
			testDetails()
				.withTags(
					JiraComponent.GAMDOM_ORIGINALS,
					JiraComponent.SOK_GAMES,
				)
				.withJiraBugTickets("8569")
				.withAuthor(JiraUser.NIKOLAY_GENOV)
				.apply(),
			async ({ originalsPage, gamdomApiDbFacade, page }) => {
				const betAmount = 5;

				const { user, cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth({});

				await setAuthenticationCookies(page, cookie);

				const userName = user.username;

				await originalsPage.navigateToGame(game);
				await originalsPage.authenticatedHeader
					.assertThat()
					.loggedInUserElementsAreVisible();

				await originalsPage.placeBet(game, betAmount);
				await originalsPage.waitForGameRoundFinish(game);

				const betData = await originalsPage
					.steps()
					.verifyBetIsDisplayedInLiveBetsSection(
						game,
						userName,
						betAmount,
					);

				await originalsPage
					.steps()
					.verifyPayoutCalculationIsCorrect(betData, game);
			},
		);
	}
});

test.describe("Displayed currency behavior", () => {
	const gamesToTest = [
		OriginalGame.Plinko,
		OriginalGame.Mines,
		OriginalGame.Keno,
	];

	for (const game of gamesToTest) {
		test(
			`[ENG-8024] 'displayCurrency' is correct after quickly changing currencies on ${game}`,
			testDetails()
				.withTags(
					JiraComponent.SOK_GAMES,
					JiraComponent[
						game.toUpperCase() as keyof typeof JiraComponent
					],
				)
				.withAuthor(JiraUser.RALUCA_ARITON)
				.apply(),
			async ({
				gamdomApiDbFacade,
				originalsPage,
				page,
				clientApiInitListener,
			}) => {
				clientApiInitListener.setGame(game);
				const { cookie } =
					await gamdomApiDbFacade.createSingleUserDbAndAuth();
				await setAuthenticationCookies(page, cookie);

				await originalsPage.navigateToGame(game);
				await originalsPage.authenticatedHeader
					.assertThat()
					.loggedInUserElementsAreVisible();

				clientApiInitListener.startListening();

				const currencySequence: Currency[] = [
					Currency.EUR,
					Currency.RUB,
					Currency.KRW,
					Currency.TRY,
					Currency.NGN,
				];

				clientApiInitListener.clearResponses();

				await originalsPage.authenticatedHeader.changeMultipleCurrencies(
					currencySequence,
					Delay.MAX_SHORT / 2,
				);

				await originalsPage
					.assertThat()
					.finalInitResponsesEndWithCurrency(
						clientApiInitListener,
						currencySequence,
					);
			},
		);
	}
});

test.describe(
	"Check amounts in 'Your Bet' & 'Wallet' are displayed correctly when switching wallets",
	testDetails()
		.withTags(
			JiraComponent.SOK_GAMES,
			JiraComponent.KENO,
			JiraComponent.MINES,
			JiraComponent.PLINKO,
		)
		.apply(),
	() => {
		testData()
			.fromCsvParsed({
				file: CsvFilesName.ORIGINALS_WALLET_SWITCHING_TESTS,
			})
			.forEach((record) => {
				const game = record.game;

				test(
					`[ENG-6967] ${game} - Switch from USD to ${record.wallet} wallet and verify balance updates correctly`,
					testDetails().withAuthor(JiraUser.NIKOLAY_GENOV).apply(),
					async ({
						originalsPage,
						userBalanceHandler,
						gamdomApiDbFacade,
						page,
						testDataPredefined,
					}) => {
						let accountBalance;
						let yourBetBalance;
						const walletUnits = Object.values(Unit);

						const { cookie } =
							await gamdomApiDbFacade.createUserWithWalletsAndAuth(
								{
									walletUnits: walletUnits,
									amount: SUPER_HIGH_USER_AMOUNT,
								},
							);

						await setAuthenticationCookies(page, cookie);
						await originalsPage.navigateToGame(game);

						accountBalance =
							await userBalanceHandler.walletBalanceInFiatRounded();
						yourBetBalance =
							await originalsPage.getYourBetValueForGame(game);

						await originalsPage.placeBet(
							game,
							testDataPredefined.data.bets.betAmountSmall,
						);

						await originalsPage.authenticatedHeader.changeWalletAndCurrency(
							record.wallet,
							Currency.USD,
						);

						await originalsPage
							.steps()
							.handleWalletSwitchDuringGameplay(
								game,
								record.wallet,
							);

						await originalsPage
							.assertThat()
							.balanceAndYourBetUpdatedSimultaneously(
								record.unit,
								accountBalance,
								yourBetBalance,
								game,
							);

						accountBalance =
							await userBalanceHandler.walletBalanceInFiatRounded(
								record.unit,
							);
						yourBetBalance =
							await originalsPage.getYourBetValueForGame(game);

						await originalsPage.placeBet(
							game,
							testDataPredefined.data.bets.betAmountSmall,
						);

						await originalsPage.authenticatedHeader.changeWalletAndCurrency(
							Currency.USD,
							Currency.USD,
						);

						await originalsPage
							.steps()
							.handleWalletSwitchDuringGameplay(
								game,
								Currency.USD,
							);

						await originalsPage
							.assertThat()
							.balanceAndYourBetUpdatedSimultaneously(
								Unit.COINS,
								accountBalance,
								yourBetBalance,
								game,
							);
					},
				);
			});
	},
);
