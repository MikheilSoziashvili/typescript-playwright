import { expect, TestInfo } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { DiceGamePage } from "./dice-game-page";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { Timeout } from "@enums/timeout";
import { parseToFloat } from "@core/utils/utils";
import { DiceAutobetTestData } from "@dtos/test-data";
import { step } from "decorators/step";
import { sanitizeAmount } from "@support/regex-patterns";

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

	@step()
	public async manualBetValueAreCorrect(
		rollover: string,
		multiplier: string,
		winChance: string,
		profitOnWin: string,
	): Promise<void> {
		const fieldValues = [
			{ field: this.gamdomPage.map.manualRollOverField, value: rollover },
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

	@step()
	public async diceSliderValueIsCorrect(diceValue: string): Promise<void> {
		await expect(this.gamdomPage.map.diceSliderValue).toHaveText(diceValue);
	}

	@step()
	public async diceMessageIsNotEmpty(): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty();
	}

	public async diceMessageIs(
		resultMessage: DiceGameResultMessage,
	): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty();

		await expect(this.gamdomPage.map.diceGameAreaMessage).toHaveText(
			resultMessage,
		);
	}

	@step()
	public async diceResultIsDisplayed(): Promise<void> {
		const diceResultGameArea =
			await this.gamdomPage.map.diceResultNumberGameArea
				.first()
				.textContent();

		expect(parseFloat(diceResultGameArea ?? "0")).toBeGreaterThan(0);

		const diceResultHistory =
			await this.gamdomPage.map.diceLastResultNumber.textContent();
		if (diceResultHistory) {
			await expect(
				this.gamdomPage.map.diceResultNumberGameArea.first(),
			).toHaveText(diceResultHistory);
		}
	}

	@step()
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

	@step()
	public async diceStopAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.stopAutobetButton,
		]);
	}

	@step()
	public async diceStartAutobetButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.startAutobetButton,
		]);
	}

	@step()
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

	@step()
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

	@step()
	public async lastBetValueIs(expectedValue: number): Promise<void> {
		await this.gamdomPage.openLastBetDetails();

		const rawText =
			(await this.gamdomPage.map.diceLastResultBetValue.textContent()) ??
			"";
		const sanitizedText = rawText.replace(sanitizeAmount, "");
		const actualValue = parseFloat(sanitizedText);

		expect(actualValue).toBe(expectedValue);
	}
}
