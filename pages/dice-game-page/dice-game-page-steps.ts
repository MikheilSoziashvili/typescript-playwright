import { BasePageStep } from "@pages/base/base-page-step";
import { DiceAutobetTestData, DiceBetTestData } from "@dtos/test-data";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { logger } from "@logger/logger";
import { DiceGamePage } from "./dice-game-page";
import {
	formatNumber,
	parseToFloat,
	truncateToDecimals,
	validateNumericValues,
	waitUntil,
} from "@core/utils/utils";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";
import { step } from "decorators/step";
import {
	getExpectedDiceBalanceAfterRoll,
	getExpectedDiceBetValues,
	isDiceWin,
} from "@formulas/betting-calculations";
import { expect } from "@playwright/test";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Timeout } from "@enums/timeout";
import { IntervalMs } from "@enums/interval-millisecond";

export class DiceGamePageSteps extends BasePageStep<DiceGamePage> {
	public constructor(gamdomPage: DiceGamePage) {
		super(gamdomPage);
	}

	@step("Play until number of wins")
	public async playUntilNumberOfWins(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<void> {
		let winCounter = 0;
		let previousDiceResult: number | null = null;
		let previousHistoryResult: number | null = null;

		do {
			let isWin = false;
			while (!isWin) {
				const accountBalanceBeforeBet =
					await this.gamdomPage.authenticatedHeader.getAccountBalance();

				await this.assertDiceBetValuesAreCorrect(diceBetData);

				await this.gamdomPage.rollDice();

				await expect
					.poll(
						async () =>
							this.gamdomPage.isManualBetInputFieldDisabled(),
						{
							message:
								"Input value should be enabled after rolling dice.",
							intervals: [IntervalMs.SHORT],
							timeout: Timeout.SHORT,
						},
					)
					.toBe(false);

				await this.gamdomPage.assertThat().diceResultIsDisplayed();

				const { newDiceResult, newHistoryResult } =
					await this.waitForNewDiceResult(
						previousDiceResult,
						previousHistoryResult,
					);

				previousDiceResult = newDiceResult;
				previousHistoryResult = newHistoryResult;

				const { parsedDiceResult } = await this.getParsedDiceResults();
				const expectedValues = getExpectedDiceBetValues(diceBetData);
				const rollOver = parseFloat(expectedValues.rollOver);

				isWin = parsedDiceResult > rollOver;

				if (diceBetData.multiplier != undefined) {
					const expectedBalance = isWin
						? accountBalanceBeforeBet +
							diceBetData.betAmount * (diceBetData.multiplier - 1)
						: accountBalanceBeforeBet - diceBetData.betAmount;
					await this.gamdomPage.authenticatedHeader
						.assertThat()
						.accountBalanceIs(expectedBalance);
				}

				if (!isWin) {
					logger.info("Dice game lost! Rolling dice again...");
				}
			}

			winCounter++;
			logger.info(`Win #${winCounter} of ${expectedWins} achieved`);
		} while (winCounter < expectedWins);
	}

	@step("Assert dice bet values are correct")
	public async assertDiceBetValuesAreCorrect(
		diceBetData: DiceBetTestData,
	): Promise<void> {
		await this.gamdomPage.fillInManualBetData(
			diceBetData.betAmount,
			diceBetData.multiplier,
		);
		await this.gamdomPage.map.manualMultiplierField.blur();
		const expectedValues = getExpectedDiceBetValues(diceBetData);
		await this.gamdomPage
			.assertThat()
			.manualBetValueAreCorrect(
				expectedValues.rollOver,
				expectedValues.multiplier,
				expectedValues.winChance,
				expectedValues.profitOnWin,
			);
		await this.gamdomPage
			.assertThat()
			.diceSliderValueIsCorrect(expectedValues.diceSliderValue ?? "");
	}

	@step("wait for dice result to be updated")
	async waitForNewDiceResult(
		previousDiceResult: number | null,
		previousHistoryResult: number | null,
	): Promise<{
		newDiceResult: number | null;
		newHistoryResult: number | null;
	}> {
		let newDiceResult: number | null = null;
		let newHistoryResult: number | null = null;

		await waitUntil(
			async () => {
				const { parsedDiceResult, parsedHistoryResult } =
					await this.getParsedDiceResults();

				if (
					previousDiceResult !== null &&
					parsedDiceResult === previousDiceResult &&
					previousHistoryResult !== null &&
					parsedHistoryResult === previousHistoryResult
				) {
					logger.info(
						`Dice result '${parsedDiceResult}' is same as previous. Waiting for change.`,
					);
					return false;
				}

				newDiceResult = parsedDiceResult;
				newHistoryResult = parsedHistoryResult;

				logger.info(`New dice result found: ${newDiceResult}`);
				return true;
			},
			{
				errorMessage: `Current dice result did not change after rolling.`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.FIVE,
			},
		);

		return { newDiceResult, newHistoryResult };
	}

	@step("Start autobet")
	public async startAutobet(diceBetData: DiceAutobetTestData): Promise<void> {
		const accountBalanceBeforeBet =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();

		await this.gamdomPage.switchToAutobetSection();
		await this.gamdomPage.fillInAutobetBetData(diceBetData);
		await this.gamdomPage
			.assertThat()
			.diceSliderValueIsCorrect(
				parseToFloat(diceBetData.rollOver as number),
			);
		await this.gamdomPage.assertThat().autobetValuesAreCorrect(diceBetData);

		await this.gamdomPage.startAutobet();

		await this.gamdomPage.assertThat().diceMessageIsNotEmpty();
		await this.gamdomPage.assertThat().diceResultIsDisplayed();
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceHasChanged(accountBalanceBeforeBet);
	}

	@step("Start and stop autobet manually")
	public async startAndStopAutobetManually(
		diceBetData: DiceAutobetTestData,
	): Promise<void> {
		await this.gamdomPage.switchToAutobetSection();
		await this.gamdomPage.fillInAutobetBetData(diceBetData);

		await this.gamdomPage.startAutobet();
		await expect(
			this.gamdomPage.isAutoBetInputFieldDisabled(),
		).resolves.toBe(true);

		await this.gamdomPage.assertThat().stopAutobetButtonIsVisible();

		await this.gamdomPage.stopAutobet();
		await expect(
			this.gamdomPage.isAutoBetInputFieldDisabled(),
		).resolves.toBe(false);
		await this.gamdomPage.assertThat().startAutobetButtonIsVisible();
	}

	@step("Autobet with increase by condition")
	public async autobetIncreaseBy(
		gameResultMessage: DiceGameResultMessage,
		diceBetData: DiceAutobetTestData,
		type: BetIncreaseCondition,
		increaseBy: number,
	): Promise<void> {
		let shouldContinue = true;

		while (shouldContinue) {
			const winConditionNotMet =
				!(await this.isWinningConditionMet(gameResultMessage));
			const diceConditionNotMet =
				!(await this.checkLastBetsAgainstRollOver(diceBetData, type));

			shouldContinue = winConditionNotMet || diceConditionNotMet;

			if (shouldContinue) {
				await this.prepareAutobetRound(diceBetData, type, increaseBy);
				await this.waitForAutobetRoundToFinish();
			}
		}
	}

	@step("Prepare autobet round")
	private async prepareAutobetRound(
		diceBetData: DiceAutobetTestData,
		type: BetIncreaseCondition,
		increaseBy: number,
	): Promise<void> {
		await this.gamdomPage.switchToAutobetSection();
		await this.gamdomPage.fillInAutobetBetData(diceBetData);
		await this.gamdomPage.fillIncreaseByInput(type, increaseBy);

		await this.gamdomPage
			.assertThat()
			.diceSliderValueIsCorrect(
				parseToFloat(diceBetData.rollOver as number),
			);
		await this.gamdomPage.assertThat().autobetValuesAreCorrect(diceBetData);

		await this.gamdomPage.startAutobet();
	}

	@step("Wait for autobet round to finish")
	private async waitForAutobetRoundToFinish(): Promise<void> {
		await waitUntil(
			async () => {
				const textContent =
					await this.gamdomPage.map.diceGameAreaMessage.textContent();
				return !textContent?.includes("Rolling");
			},
			{
				errorMessage: "Dice never finished rolling within the timeout.",
				intervalSeconds: 2,
				timeoutSeconds: 6,
			},
		);

		await this.gamdomPage.assertThat().diceMessageIsNotEmpty();
		await this.gamdomPage.assertThat().diceResultIsDisplayed();
	}

	@step("Check if winning condition is met")
	private async isWinningConditionMet(
		gameResultMessage: DiceGameResultMessage,
	): Promise<boolean> {
		const diceGameAreaMessage =
			await this.gamdomPage.map.diceGameAreaMessage.textContent();
		return diceGameAreaMessage === gameResultMessage;
	}

	@step("Open history and assert last bet")
	public async openHistoryAndAssertLastBet(
		expectedLastBet: number,
	): Promise<void> {
		await this.gamdomPage.openDiceHistory();
		await this.gamdomPage.assertThat().lastBetValueIs(expectedLastBet);
	}

	@step("Check last bets against roll over")
	public async checkLastBetsAgainstRollOver(
		autobetData: DiceAutobetTestData,
		type: BetIncreaseCondition,
	): Promise<boolean> {
		const { rollOver, numberOfBets } = autobetData;

		await this.gamdomPage.assertThat().checkElementsAreDefined([
			{
				value: rollOver,
				message: "rollOver must be defined in DiceAutobetTestData",
			},
			{
				value: numberOfBets,
				message: "numberOfBets must be defined in DiceAutobetTestData",
			},
		]);

		const validRollOver = rollOver as number;
		const validNumberOfBets = numberOfBets as number;

		const allResults =
			await this.gamdomPage.map.diceAllLastResultsNumber.allTextContents();
		const lastResults = allResults.slice(0, validNumberOfBets);

		if (lastResults.length < validNumberOfBets) {
			return false;
		}

		const resultNumbers = validateNumericValues(
			lastResults,
			"Invalid dice result number",
		);

		for (const resultNumber of resultNumbers) {
			switch (type) {
				case BetIncreaseCondition.WIN:
					if (resultNumber < validRollOver) {
						return false;
					}
					break;
				case BetIncreaseCondition.LOSS:
					if (resultNumber > validRollOver) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	@step("Get parsed dice results")
	private async getParsedDiceResults(): Promise<{
		parsedDiceResult: number;
		parsedHistoryResult: number;
	}> {
		const tempDiceText = await this.gamdomPage.map.diceResultNumberGameArea
			.first()
			.textContent();
		const tempHistoryText =
			await this.gamdomPage.map.diceLastResultNumber.textContent();

		const parsedDiceResult = parseFloat(tempDiceText ?? "0");
		const parsedHistoryResult = parseFloat(tempHistoryText ?? "0");

		logger.info(`Current dice result: ${parsedDiceResult}`);
		logger.info(`Current dice history result: ${parsedHistoryResult}`);

		return { parsedDiceResult, parsedHistoryResult };
	}

	@step("Place winning bet")
	public async placeWinningBet(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<void> {
		await this.assertDiceBetValuesAreCorrect(diceBetData);

		await this.playUntilNumberOfWins(diceBetData, expectedWins);
	}

	@step("Open Dice and verify default state - v4")
	public async openDefaultGameStateV4(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().defaultGameStateIsCorrectV4();
	}

	@step("Play until number of wins - v4")
	public async playUntilNumberOfWinsV4(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<number> {
		let winCounter = 0;
		let previousDiceResult: number | null = null;
		let previousHistoryResult: number | null = null;
		let lastWinResult: number | null = null;

		while (winCounter < expectedWins) {
			const {
				previousDiceResult: newPreviousDiceResult,
				previousHistoryResult: newPreviousHistoryResult,
				winResult,
			} = await this.rollUntilWinV4(
				diceBetData,
				previousDiceResult,
				previousHistoryResult,
			);

			previousDiceResult = newPreviousDiceResult;
			previousHistoryResult = newPreviousHistoryResult;
			lastWinResult = winResult;

			winCounter++;
			logger.info(`Win #${winCounter} of ${expectedWins} achieved`);
		}

		if (lastWinResult === null) {
			throw new Error(
				`Expected to achieve ${expectedWins} wins but lastWinResult was null`,
			);
		}

		return lastWinResult;
	}

	@step("Roll dice until win - v4")
	private async rollUntilWinV4(
		diceBetData: DiceBetTestData,
		previousDiceResult: number | null,
		previousHistoryResult: number | null,
	): Promise<{
		previousDiceResult: number | null;
		previousHistoryResult: number | null;
		winResult: number;
	}> {
		let isWin = false;
		let winResult = 0;

		while (!isWin) {
			const accountBalanceBeforeBet =
				await this.gamdomPage.authenticatedHeader.getAccountBalanceV4();

			await this.playOneDiceRoundV4(diceBetData);
			await this.waitForManualBetInputToBeEnabledV4();
			await this.gamdomPage.assertThat().diceResultIsDisplayedV4();
			const { parsedDiceResult } = await this.getParsedDiceResultsV4();

			const updatedResults = await this.updatePreviousDiceResultsV4(
				previousDiceResult,
				previousHistoryResult,
			);
			previousDiceResult = updatedResults.previousDiceResult;
			previousHistoryResult = updatedResults.previousHistoryResult;

			isWin = await this.isDiceWinV4(diceBetData);
			if (isWin) {
				winResult = parsedDiceResult;
			}
			await this.assertExpectedBalanceAfterRollV4(
				diceBetData,
				accountBalanceBeforeBet,
				isWin,
			);

			if (!isWin) {
				logger.info("Dice game lost! Rolling dice again...");
			}
		}

		return {
			previousDiceResult: previousDiceResult,
			previousHistoryResult: previousHistoryResult,
			winResult: winResult,
		};
	}

	@step("Play one dice round - v4")
	private async playOneDiceRoundV4(
		diceBetData: DiceBetTestData,
	): Promise<void> {
		await this.assertDiceBetValuesAreCorrectV4(diceBetData);
		await this.gamdomPage.rollDiceV4();
	}

	@step("Wait for manual bet input to be enabled - v4")
	private async waitForManualBetInputToBeEnabledV4(): Promise<void> {
		await expect
			.poll(
				async () => this.gamdomPage.isManualBetInputFieldDisabledV4(),
				{
					message:
						"Input value should be enabled after rolling dice.",
					intervals: [IntervalMs.SHORT],
					timeout: Timeout.SHORT,
				},
			)
			.toBe(false);
	}

	@step("Update previous dice results - v4")
	private async updatePreviousDiceResultsV4(
		previousDiceResult: number | null,
		previousHistoryResult: number | null,
	): Promise<{
		previousDiceResult: number | null;
		previousHistoryResult: number | null;
	}> {
		const newResults = await this.waitForNewDiceResultV4(
			previousDiceResult,
			previousHistoryResult,
		);

		return {
			previousDiceResult: newResults.newDiceResult,
			previousHistoryResult: newResults.newHistoryResult,
		};
	}

	@step("Check if dice roll is a win - v4")
	private async isDiceWinV4(diceBetData: DiceBetTestData): Promise<boolean> {
		const { parsedDiceResult } = await this.getParsedDiceResultsV4();
		const expectedValues = getExpectedDiceBetValues(diceBetData);
		const rollOver = parseFloat(expectedValues.rollOver);

		return isDiceWin(parsedDiceResult, rollOver);
	}

	@step("Assert expected balance after roll - v4")
	private async assertExpectedBalanceAfterRollV4(
		diceBetData: DiceBetTestData,
		accountBalanceBeforeBet: number,
		isWin: boolean,
	): Promise<void> {
		const expectedBalance = getExpectedDiceBalanceAfterRoll({
			accountBalanceBeforeBet: accountBalanceBeforeBet,
			betAmount: diceBetData.betAmount,
			multiplier: diceBetData.multiplier,
			isWin: isWin,
		});

		if (expectedBalance === null) {
			return;
		}

		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
	}

	@step("Assert dice bet values are correct - v4")
	public async assertDiceBetValuesAreCorrectV4(
		diceBetData: DiceBetTestData,
	): Promise<void> {
		await this.gamdomPage.fillInManualBetDataV4(
			diceBetData.betAmount,
			diceBetData.multiplier,
		);
		await this.gamdomPage.map.manualMultiplierFieldV4.blur();
		const expectedValues = getExpectedDiceBetValues(diceBetData);
		await this.gamdomPage
			.assertThat()
			.manualBetValuesAreCorrectV4(
				expectedValues.rollOver,
				expectedValues.multiplier,
				expectedValues.winChance,
				expectedValues.profitOnWin,
			);
	}

	@step("Place winning bet - v4")
	public async placeWinningBetV4(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<void> {
		await this.assertDiceBetValuesAreCorrectV4(diceBetData);

		await this.playUntilNumberOfWinsV4(diceBetData, expectedWins);
	}

	@step("wait for dice result to be updated - v4")
	async waitForNewDiceResultV4(
		previousDiceResult: number | null,
		previousHistoryResult: number | null,
	): Promise<{
		newDiceResult: number | null;
		newHistoryResult: number | null;
	}> {
		let newDiceResult: number | null = null;
		let newHistoryResult: number | null = null;

		await waitUntil(
			async () => {
				const currentResults = await this.getCurrentDiceResultsV4();

				if (
					await this.areDiceResultsSameV4(
						{
							dice: previousDiceResult,
							history: previousHistoryResult,
						},
						currentResults,
					)
				) {
					logger.info(
						`Dice result '${currentResults.dice}' is same as previous. Waiting for change.`,
					);
					return false;
				}

				newDiceResult = currentResults.dice;
				newHistoryResult = currentResults.history;

				logger.info(`New dice result found: ${newDiceResult}`);
				return true;
			},
			{
				errorMessage: `Current dice result did not change after rolling.`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.FIVE,
			},
		);

		return { newDiceResult, newHistoryResult };
	}

	@step("Compare dice results - v4")
	private async areDiceResultsSameV4(
		previous: { dice: number | null; history: number | null },
		current: { dice: number; history: number },
	): Promise<boolean> {
		const hasPrevious = previous.dice !== null && previous.history !== null;
		return (
			hasPrevious &&
			current.dice === previous.dice &&
			current.history === previous.history
		);
	}

	@step("Get current dice results - v4")
	private async getCurrentDiceResultsV4(): Promise<{
		dice: number;
		history: number;
	}> {
		const { parsedDiceResult, parsedHistoryResult } =
			await this.getParsedDiceResultsV4();

		return { dice: parsedDiceResult, history: parsedHistoryResult };
	}

	@step("Get parsed dice results - v4")
	private async getParsedDiceResultsV4(): Promise<{
		parsedDiceResult: number;
		parsedHistoryResult: number;
	}> {
		const tempDiceText =
			await this.gamdomPage.map.diceResultNumberGameAreaV4
				.first()
				.textContent();
		const tempHistoryText =
			await this.gamdomPage.map.diceLastResultNumberV4.textContent();

		const parsedDiceResult = parseFloat(tempDiceText ?? "0");
		const parsedHistoryResult = parseFloat(tempHistoryText ?? "0");

		logger.info(`Current dice result: ${parsedDiceResult}`);
		logger.info(`Current dice history result: ${parsedHistoryResult}`);

		return { parsedDiceResult, parsedHistoryResult };
	}

	@step("Verify Fairness table contains win value - v4")
	public async fairnessTableContainsWinValueV4(
		expectedRolledValue: number,
	): Promise<void> {
		await this.gamdomPage.openFairnessTabV4();

		await this.gamdomPage.assertThat().fairnessTableIsVisibleV4();

		const expected = formatNumber(expectedRolledValue, 2);

		await expect
			.poll(
				async () => {
					const texts =
						await this.gamdomPage.map.fairnessRolledCellsV4.allTextContents();

					const numericValues = validateNumericValues(
						texts,
						"Invalid fairness rolled value",
					);

					const truncated = numericValues.map((value) =>
						parseToFloat(truncateToDecimals(value, 2), 2),
					);

					return truncated.includes(expected);
				},
				{
					message: `Fairness results should include rolled value ${expected}`,
					timeout: Timeout.SHORT,
					intervals: [IntervalMs.SHORT],
				},
			)
			.toBe(true);
	}
}
