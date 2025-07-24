import { DATASETS_DIR } from "@constants/file-paths";
import { parse_csv, roundToDecimals } from "@core/utils/utils";
import {
	NegativeBetValidationScenario,
	QuickSelectScenario,
	RawNegativeBetValidationScenario,
	RawQuickSelectScenario,
} from "@dtos/test-data";
import { CsvFilesName } from "@enums/csv-file-name";
import {
	OriginalGame,
	OriginalsQuickSelectButtons,
} from "@enums/original-games";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";
import { HIGH_USER_AMOUNT } from "database/constants/user-amounts";

test.describe("Quick Select Buttons", () => {
	test.use(storageStateNewUserDB());

	const quickSelectRawRows = parse_csv(
		DATASETS_DIR,
		CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS,
	) as RawQuickSelectScenario[];

	const quickSelectScenarios: QuickSelectScenario[] = quickSelectRawRows.map(
		(raw) => ({
			buttonType: raw.buttonType as OriginalsQuickSelectButtons,
			game: OriginalGame[raw.game as keyof typeof OriginalGame],
			initialBetAmount: parseFloat(raw.initialBetAmount),
			expectedAfterFirstClick: parseFloat(raw.expectedAfterFirstClick),
			expectedAfterSecondClick: parseFloat(raw.expectedAfterSecondClick),
		}),
	);
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
		for (const { game, initialBetAmount } of minScenario) {
			test(
				`[ENG-5455] should set min amount for ${game}`,
				{
					tag: ["@originals"],
				},
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);
					await originalsPage.steps().pressMinButton(game);
					await originalsPage.assertThat().betAmountIsMin(game);
					await originalsPage.steps().pressMinButton(game);
					await originalsPage.steps().pressHalfButton(game);
					await originalsPage.assertThat().betAmountIsMin(game);
				},
			);
		}
	});

	test.describe("HALF button", () => {
		for (const {
			game,
			initialBetAmount,
			expectedAfterFirstClick,
			expectedAfterSecondClick,
		} of halfScenario) {
			test(
				`[ENG-5454] should halve bet for ${game} with initial bet ${initialBetAmount}`,
				{
					tag: ["@originals"],
				},
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();

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
					await originalsPage.assertThat().betAmountIsMin(game);
				},
			);
		}
	});

	test.describe("MAX button", () => {
		test.use(storageStateNewUserDB({ amount: HIGH_USER_AMOUNT }));

		for (const { game, initialBetAmount } of maxScenario) {
			test(
				`[ENG-5053] should set max amount for ${game}`,
				{
					tag: ["@originals"],
				},
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();
					await originalsPage
						.steps()
						.setBetAmount(game, initialBetAmount);
					await originalsPage.steps().pressMaxButton(game);
					await originalsPage.assertThat().betAmountIsMax(game);
					await originalsPage.steps().pressMaxButton(game);
					await originalsPage.steps().pressDoubleButton(game);
					await originalsPage.assertThat().betAmountIsMax(game);
				},
			);
		}
	});

	test.describe("DOUBLE button", () => {
		test.use(storageStateNewUserDB({ amount: HIGH_USER_AMOUNT }));

		for (const {
			game,
			initialBetAmount,
			expectedAfterFirstClick,
			expectedAfterSecondClick,
		} of doubleScenario) {
			test(
				`[ENG-5456] should double bet for ${game} with initial bet ${initialBetAmount}`,
				{
					tag: ["@originals"],
				},
				async ({ originalsPage }) => {
					await originalsPage.navigateToGame(game);
					await originalsPage.authenticatedHeader
						.assertThat()
						.loggedInUserElementsAreVisible();

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
					await originalsPage.assertThat().betAmountIsMax(game);
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
				{
					tag: ["@originals, @mines, @plinko, @keno"],
				},
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
