import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { DiceGamePage } from "./dice-game-page";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { Timeout } from "@enums/timeout";
import { parseToFloat } from "@core/utils/utils";
import { DiceAutobetTestData } from "@dtos/test-data";

export class DiceGamePageAsserter extends BaseAsserter<DiceGamePage> {
	public constructor(page: DiceGamePage) {
		super(page);
	}

	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.diceGameAreaMessage,
				this.gamdomPage.map.rollDiceBtn,
			],
			Timeout.MAX,
		);
	}

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

	public async diceSliderValueIsCorrect(diceValue: string): Promise<void> {
		await expect(this.gamdomPage.map.diceSliderValue).toHaveText(diceValue);
	}

	public async diceMessageIsNotEmpty(): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty({
			timeout: Timeout.MEDIUM,
		});
	}

	public async diceMessageIs(
		resultMessage: DiceGameResultMessage,
	): Promise<void> {
		await expect(this.gamdomPage.map.diceGameAreaMessage).not.toBeEmpty({
			timeout: Timeout.MEDIUM,
		});

		await expect(this.gamdomPage.map.diceGameAreaMessage).toHaveText(
			resultMessage,
			{ timeout: Timeout.MEDIUM },
		);
	}

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

	public async autobetValuesAreCorrect(
		autobetData: DiceAutobetTestData,
	): Promise<void> {
		await expect(this.gamdomPage.map.autobetYourBetInput).toHaveValue(
			parseToFloat(autobetData.betAmount),
		);
		if (autobetData.nbOfBets) {
			await expect(this.gamdomPage.map.autobetNbOfBetsInput).toHaveValue(
				autobetData.nbOfBets.toString(),
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

	// TODO: If you win the first game, stopAutbetButton will not appear at all and there will be failure here.
	// This case should be handled!
	public async diceStopAutobetButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.stopAutobetButton).toBeVisible();
	}
}
