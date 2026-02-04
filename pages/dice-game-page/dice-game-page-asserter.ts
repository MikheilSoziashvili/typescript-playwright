import { expect, TestInfo } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { DiceGamePage } from "./dice-game-page";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { Timeout } from "@enums/timeout";
import { formatNumber, parseToFloat } from "@core/utils/utils";
import { DiceAutobetTestData } from "@dtos/test-data";
import { step } from "decorators/step";
import { sanitizeAmount } from "@support/regex-patterns";
import { IntervalMs } from "@enums/interval-millisecond";
import { testData } from "test-data/test-data-manager";
import { Button } from "@enums/buttons-texts";

export class DiceGamePageAsserter extends BaseAsserter<DiceGamePage> {
	public constructor(page: DiceGamePage) {
		super(page);
	}

	@step("Dice game message and roll dice button are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.diceGameAreaMessage,
				this.gamdomPage.map.rollDiceBtn,
			],
			Timeout.MAX,
		);
	}

	@step("Manual bet and profitOnWin values are correct")
	public async manualBetAndProfitOnWinValuesAreCorrect(
		betValue: number,
		profitOnWin: number,
	): Promise<void> {
		const fieldValues = [
			{
				field: this.gamdomPage.map.manualBetField,
				value: parseToFloat(betValue),
			},
			{
				field: this.gamdomPage.map.manualProfitOnWinField,
				value: parseToFloat(profitOnWin),
			},
		];

		for (const { field, value } of fieldValues) {
			await expect(field).toHaveValue(value);
		}
	}

	@step("Manual bet value are correct")
	public async manualBetValueAreCorrect(
		rollover: string,
		multiplier: string,
		winChance: string,
		profitOnWin: string,
	): Promise<void> {
		const fieldValues = [
			{
				field: this.gamdomPage.map.manualRollOverField,
				value: rollover,
			},
			{
				field: this.gamdomPage.map.manualMultiplierField,
				value: multiplier,
			},
			{
				field: this.gamdomPage.map.manualWinChanceField,
				value: winChance,
			},
			{
				field: this.gamdomPage.map.manualProfitOnWinField,
				value: profitOnWin,
			},
		];

		for (const { field, value } of fieldValues) {
			await expect(field).toHaveValue(value);
		}
	}

	@step("Dice message is not empty")
	public async diceMessageIsNotEmpty(): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty();
	}

	@step("Check dice message")
	public async diceMessageIs(
		resultMessage: DiceGameResultMessage,
	): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty();
		await expect(this.gamdomPage.map.diceGameAreaMessage).toHaveText(
			resultMessage,
			{
				timeout: Timeout.SHORT,
			},
		);
	}

	@step("Autobet values are correct")
	public async autobetValuesAreCorrect(
		autobetData: DiceAutobetTestData,
	): Promise<void> {
		await expect(this.gamdomPage.map.autobetYourBetInput).toHaveValue(
			parseToFloat(autobetData.betAmount),
		);
		if (autobetData.numberOfBets) {
			await expect(this.gamdomPage.map.autobetNbOfBetsInput).toHaveValue(
				autobetData.numberOfBets.toString(),
			);
		}
		if (autobetData.rollOver) {
			await expect(this.gamdomPage.map.autobetRollOverInput).toHaveValue(
				parseToFloat(autobetData.rollOver, 6),
			);
		}
		if (autobetData.stopOnProfit) {
			await expect(
				this.gamdomPage.map.autobetStopOnProfitInput,
			).toHaveValue(parseToFloat(autobetData.stopOnProfit));
		}

		if (autobetData.stopOnLoss) {
			await expect(
				this.gamdomPage.map.autobetStopOnLossInput,
			).toHaveValue(parseToFloat(autobetData.stopOnLoss));
		}
	}

	@step("Dice stop autobet button is displayed")
	public async diceStopAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.stopAutobetButton,
		]);
	}

	@step("Dice start autobet button is displayed")
	public async diceStartAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startAutobetButton,
		]);
	}

	@step("Balance after auto bet is correct")
	public async balanceAfterAutoBetIsCorrect(
		initialBalance: number,
		diceBetData: DiceAutobetTestData,
	): Promise<void> {
		let expectedBalance = initialBalance;

		for (let i = 0; i < (diceBetData.numberOfBets ?? 0); i++) {
			const newBalance =
				await this.gamdomPage.authenticatedHeader.getAccountBalance();
			expectedBalance = newBalance;

			const profit = expectedBalance - initialBalance;
			const loss = initialBalance - expectedBalance;

			if (this.shouldStopOn(diceBetData.stopOnProfit, profit)) {
				return;
			}

			if (this.shouldStopOn(diceBetData.stopOnLoss, loss)) {
				return;
			}
		}

		const finalBalance =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();
		expect(finalBalance).toEqual(expectedBalance);
	}

	@step("Dice manual bet menu visual is correct")
	public async diceManualBetMenuVisualIsCorrect(
		testInfo: TestInfo,
	): Promise<void> {
		await this.checkElementVisualCorrect(
			testInfo,
			this.gamdomPage.map.betMenu,
			{
				toHaveScreenshotOptions: {
					mask: [this.gamdomPage.map.diceAutobetTabButton],
				},
			},
		);
	}

	private shouldStopOn(limit: number | undefined, value: number): boolean {
		return limit !== undefined && value >= limit;
	}

	@step("Last bet value is")
	public async lastBetValueIs(expectedValue: number): Promise<void> {
		const rawText =
			(await this.gamdomPage.map.diceLastResultBetValue.textContent()) ??
			"";
		const sanitizedText = rawText.replace(sanitizeAmount, "");
		const actualValue = parseFloat(sanitizedText);

		expect(actualValue).toBe(expectedValue);
	}

	@step("Start autobet button is visible")
	public async startAutobetButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startAutobetButton,
		]);
	}

	@step("Stop autobet button is visible")
	public async stopAutobetButtonIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.stopAutobetButton,
		]);
	}

	@step("Verify multiplier default value")
	public async multiplierDefaultValueIsCorrect(): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.manualMultiplierField,
				expectedValue: formatNumber(
					testData().fromPredefined().data.dice.defaultMultiplier,
					2,
				),
			},
		]);
	}

	@step("Manual bet value are correct")
	public async manualBetValuesAreCorrect(
		rollover: string,
		multiplier: string,
		winChance: string,
		profitOnWin: string,
	): Promise<void> {
		const fieldValues = [
			{
				field: this.gamdomPage.map.manualRollOverField,
				value: rollover,
			},
			{
				field: this.gamdomPage.map.manualMultiplierField,
				value: multiplier,
			},
			{
				field: this.gamdomPage.map.manualWinChanceField,
				value: winChance,
			},
			{
				field: this.gamdomPage.map.manualProfitOnWinField,
				value: profitOnWin,
			},
		];

		for (const { field, value } of fieldValues) {
			await expect(field).toHaveValue(value);
		}
	}

	@step("Dice slider value is correct")
	public async diceSliderValueIsCorrect(diceValue: string): Promise<void> {
		await expect(this.gamdomPage.map.diceSliderValue).toHaveText(diceValue);
	}

	@step("Dice result is displayed")
	public async diceResultIsDisplayed(): Promise<number> {
		const diceResultGameArea =
			await this.gamdomPage.map.diceResultNumberGameArea
				.first()
				.textContent();

		expect(parseFloat(diceResultGameArea ?? "0")).toBeGreaterThanOrEqual(0);

		const diceResultHistory =
			await this.gamdomPage.map.diceLastResultNumber.textContent();

		const expectedDiceResult = parseFloat(diceResultHistory ?? "0");

		expect(
			expectedDiceResult,
			"Dice result history must be a valid number and not empty",
		).toBeGreaterThanOrEqual(0);

		await expect
			.poll(
				async () => {
					const rawCurrent =
						await this.gamdomPage.map.diceAllLastResultsNumber
							.first()
							.textContent();

					return parseFloat(rawCurrent ?? "0");
				},
				{
					message:
						"Dice result history is not the same as current dice result",
					timeout: Timeout.SHORT,
					intervals: [IntervalMs.SHORT],
				},
			)
			.toBeCloseTo(expectedDiceResult, 2);

		return expectedDiceResult;
	}

	@step("Verify dice default values")
	public async defaultValuesAreCorrect(): Promise<void> {
		const diceDefaults = testData().fromPredefined().data.dice;

		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.manualMultiplierField,
				expectedValue: formatNumber(diceDefaults.defaultMultiplier, 2),
			},
			{
				locator: this.gamdomPage.map.manualRollOverField,
				expectedValue: formatNumber(diceDefaults.defaultRollover, 6),
			},
			{
				locator: this.gamdomPage.map.manualWinChanceField,
				expectedValue: formatNumber(diceDefaults.defaultWinChance, 2),
			},
		]);
	}

	@step("Roll dice button is visible")
	public async rollDiceButtonIsVisible(): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.rollDiceBtn,
				expectedText: Button.ROLL_DICE,
			},
		]);
	}

	@step("Verify that fairness table is visible")
	public async fairnessTableIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.fairnessTableBody,
		]);
	}

	@step("Verify Dice default game state")
	public async defaultGameStateIsCorrect(): Promise<void> {
		await this.defaultValuesAreCorrect();
		await this.rollDiceButtonIsVisible();
	}
}
