import { BasePageStep } from "@pages/base/base-page-step";
import { DiceAutobetTestData, DiceBetTestData } from "@dtos/test-data";
import { logger } from "@logger/logger";
import { DiceGamePage } from "./dice-game-page";
import {
	formatNumber,
	parseToFloat,
	truncateToDecimals,
	validateNumericValues,
	waitUntil,
} from "@core/utils/utils";
import { step } from "decorators/step";
import {
	calculateBetAmountWithPercentage,
	getExpectedDiceBalanceAfterRoll,
	getExpectedDiceBetValues,
	isDiceWin,
} from "@formulas/betting-calculations";
import { testData } from "test-data/test-data-manager";
import { expect } from "@playwright/test";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { Timeout } from "@enums/timeout";
import { IntervalMs } from "@enums/interval-millisecond";

export class DiceGamePageSteps extends BasePageStep<DiceGamePage> {
	public constructor(gamdomPage: DiceGamePage) {
		super(gamdomPage);
	}

	@step("Start autobet")
	public async startAutobet(diceBetData: DiceAutobetTestData): Promise<void> {
		const accountBalanceBeforeBet =
			await this.userBalanceHandler.walletBalanceInFiatRounded();

		await this.gamdomPage.switchToAutobetSection();
		await this.gamdomPage.fillInAutobetBetData(diceBetData);
		await this.gamdomPage
			.assertThat()
			.diceSliderValueIsCorrect(
				parseToFloat(diceBetData.rollOver as number),
			);
		await this.gamdomPage.assertThat().autobetValuesAreCorrect(diceBetData);

		await this.gamdomPage.startAutobet();

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

	@step("Play autobet rounds until win and loss detected")
	public async playAutobetUntilWinAndLoss(
		betAmount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		const defaultRollover =
			testData().fromPredefined().data.dice.defaultRollover;
		let hasWin = false;
		let hasLoss = false;
		let currentBet = betAmount;

		while (!hasWin || !hasLoss) {
			logger.info(`Current bet amount before round: ${currentBet}`);
			await this.gamdomPage.startAutobet();
			await expect
				.poll(
					async () => this.gamdomPage.isAutoBetInputFieldDisabled(),
					{
						message:
							"Autobet input should be enabled after autobet completes.",
						intervals: [IntervalMs.SHORT],
						timeout: Timeout.SHORT,
					},
				)
				.toBe(false);

			const { parsedDiceResult } = await this.getParsedDiceResults();
			const isWin = isDiceWin(parsedDiceResult, defaultRollover);

			logger.info(`Dice result: ${parsedDiceResult}, isWin: ${isWin}`);

			if (isWin && !hasWin) {
				hasWin = true;
				currentBet = await this.updateAndVerifyBetAmount(
					currentBet,
					onWinPercentage,
				);
			} else if (!isWin && !hasLoss) {
				hasLoss = true;
				currentBet = await this.updateAndVerifyBetAmount(
					currentBet,
					onLossPercentage,
				);
			} else {
				currentBet = await this.waitForBetAmountChange(currentBet);
			}

			logger.info(`Updated bet amount: ${currentBet}`);
		}
	}

	@step("Verify bet amount increased by percentage")
	public async verifyBetAmountIncreasedBy(
		previousBet: number,
		percentage: number,
	): Promise<number> {
		const actualBet = await this.gamdomPage.getBetAmountInputValue();
		const expectedBet = calculateBetAmountWithPercentage(
			previousBet,
			percentage,
		);
		expect(actualBet).toBeCloseTo(expectedBet, 1);
		return actualBet;
	}

	@step("Wait for bet amount to change")
	private async waitForBetAmountChange(currentBet: number): Promise<number> {
		await waitUntil(
			async () => {
				const value = await this.gamdomPage.getBetAmountInputValue();
				return currentBet !== value;
			},
			{
				errorMessage: `Bet amount did not change from ${currentBet}`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.FIVE,
			},
		);
		return this.gamdomPage.getBetAmountInputValue();
	}

	@step("Update and verify bet amount")
	private async updateAndVerifyBetAmount(
		currentBet: number,
		percentage: number,
	): Promise<number> {
		await this.waitForBetAmountChange(currentBet);
		return this.verifyBetAmountIncreasedBy(currentBet, percentage);
	}

	@step("Open history and assert last bet")
	public async openHistoryAndAssertLastBet(
		expectedLastBet: number,
	): Promise<void> {
		await this.gamdomPage.openDiceHistory();
		await this.gamdomPage.assertThat().lastBetValueIs(expectedLastBet);
	}

	@step("Open Dice and verify default state")
	public async openDefaultGameState(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().defaultGameStateIsCorrect();
	}

	@step("Play until number of wins")
	public async playUntilNumberOfWins(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<number> {
		let previousDiceResult: number | null = null;
		let previousHistoryResult: number | null = null;
		let winResult = 0;

		for (let i = 0; i < expectedWins; i++) {
			({ previousDiceResult, previousHistoryResult, winResult } =
				await this.rollUntilWin(
					diceBetData,
					previousDiceResult,
					previousHistoryResult,
				));
			logger.info(`Win #${i + 1} of ${expectedWins} achieved`);
		}

		return winResult;
	}

	@step("Roll dice until win")
	private async rollUntilWin(
		diceBetData: DiceBetTestData,
		previousDiceResult: number | null,
		previousHistoryResult: number | null,
	): Promise<{
		previousDiceResult: number | null;
		previousHistoryResult: number | null;
		winResult: number;
	}> {
		const rollOver = parseFloat(
			getExpectedDiceBetValues(diceBetData).rollOver,
		);

		while (true) {
			const accountBalanceBeforeBet =
				await this.userBalanceHandler.walletBalanceInFiatRounded();

			await this.playOneDiceRound(diceBetData);
			await this.gamdomPage.assertThat().diceResultIsDisplayed();

			const { newDiceResult, newHistoryResult } =
				await this.waitForNewDiceResult(
					previousDiceResult,
					previousHistoryResult,
				);
			previousDiceResult = newDiceResult;
			previousHistoryResult = newHistoryResult;

			const winResult = previousDiceResult ?? 0;
			const isWin = isDiceWin(winResult, rollOver);
			await this.assertExpectedBalanceAfterRoll(
				diceBetData,
				accountBalanceBeforeBet,
				isWin,
			);

			if (isWin) {
				return { previousDiceResult, previousHistoryResult, winResult };
			}

			logger.info("Dice game lost! Rolling dice again...");
		}
	}

	@step("Play one dice round")
	private async playOneDiceRound(
		diceBetData: DiceBetTestData,
	): Promise<void> {
		await this.assertDiceBetValuesAreCorrect(diceBetData);
		await this.gamdomPage.rollDice();
	}

	@step("Assert expected balance after roll")
	private async assertExpectedBalanceAfterRoll(
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
			.manualBetValuesAreCorrect(
				expectedValues.rollOver,
				expectedValues.multiplier,
				expectedValues.winChance,
				expectedValues.profitOnWin,
			);
	}

	@step("Place winning bet")
	public async placeWinningBet(
		diceBetData: DiceBetTestData,
		expectedWins: number,
	): Promise<void> {
		await this.assertDiceBetValuesAreCorrect(diceBetData);

		await this.playUntilNumberOfWins(diceBetData, expectedWins);
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
				const currentResults = {
					dice: parsedDiceResult,
					history: parsedHistoryResult,
				};

				if (
					await this.areDiceResultsSame(
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

	@step("Compare dice results")
	private async areDiceResultsSame(
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

	@step("Get parsed dice results")
	private async getParsedDiceResults(): Promise<{
		parsedDiceResult: number;
		parsedHistoryResult: number;
	}> {
		const tempDiceText =
			await this.gamdomPage.map.diceResultNumberGameArea.textContent();
		const tempHistoryText =
			await this.gamdomPage.map.diceLastResultNumber.textContent();

		const parsedDiceResult = parseFloat(tempDiceText ?? "0");
		const parsedHistoryResult = parseFloat(tempHistoryText ?? "0");

		logger.info(`Current dice result: ${parsedDiceResult}`);
		logger.info(`Current dice history result: ${parsedHistoryResult}`);

		return { parsedDiceResult, parsedHistoryResult };
	}

	@step("Verify Fairness table contains win value")
	public async fairnessTableContainsWinValue(
		expectedRolledValue: number,
	): Promise<void> {
		await this.gamdomPage.openFairnessTab();

		await this.gamdomPage.assertThat().fairnessTableIsVisible();

		const expected = formatNumber(expectedRolledValue, 2);

		await expect
			.poll(
				async () => {
					const texts =
						await this.gamdomPage.map.fairnessRolledCells.allTextContents();

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
