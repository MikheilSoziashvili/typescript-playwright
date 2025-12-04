import { BasePageStep } from "@pages/base/base-page-step";
import { DiceAutobetTestData, DiceBetTestData } from "@dtos/test-data";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { logger } from "@logger/logger";
import { DiceGamePage } from "./dice-game-page";
import {
	parseToFloat,
	validateNumericValues,
	waitUntil,
} from "@core/utils/utils";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";
import { step } from "decorators/step";
import { getExpectedDiceBetValues } from "@formulas/betting-calculations";
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
			const winConditionNotMet = !(await this.isWinningConditionMet(
				gameResultMessage,
			));
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
}
