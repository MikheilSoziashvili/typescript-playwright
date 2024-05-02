import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { DiceGamePage } from "./dice-game-page";
import { DiceGameResultMessage } from "../../enums/dice-result-messages";
import { Timeout } from "../../enums/timeout";
import { parseToFloat } from "../../core/utils";

export class DiceGamePageAsserter extends BaseAsserter<DiceGamePage> {
	public constructor(page: DiceGamePage) {
		super(page);
	}

	public async betAndProfitOnWinValuesAreCorrect(
		betValue: number,
		profitOnWin: number,
	): Promise<void> {
		const fieldValues = [
			{
				field: this.gamdomPage.map.betField,
				value: parseToFloat(betValue),
			},
			{
				field: this.gamdomPage.map.profitOnWinField,
				value: parseToFloat(profitOnWin),
			},
		];

		for (const { field, value } of fieldValues) {
			await expect(field).toHaveValue(value);
		}
	}

	public async betValuesAreCorrect(
		rollover: string,
		multiplier: string,
		winChance: string,
		profitOnWin: string,
	): Promise<void> {
		const fieldValues = [
			{ field: this.gamdomPage.map.rollOverField, value: rollover },
			{ field: this.gamdomPage.map.multiplierField, value: multiplier },
			{ field: this.gamdomPage.map.winChanceField, value: winChance },
			{ field: this.gamdomPage.map.profitOnWinField, value: profitOnWin },
		];

		for (const { field, value } of fieldValues) {
			await expect(field).toHaveValue(value);
		}
	}

	public async diceValueIsCorrect(diceValue: string): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.diceSliderValue)
			.toHaveText(diceValue);
	}

	public async diceMessageIsNotEmpty(): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.diceGameAreaMessage)
			.not.toBeEmpty({
				timeout: Timeout.MEDIUM,
			});
	}

	public async diceMessageIs(
		resultMessage: DiceGameResultMessage,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.diceGameAreaMessage)
			.not.toBeEmpty({
				timeout: Timeout.MEDIUM,
			});

		await expect
			.soft(this.gamdomPage.map.diceGameAreaMessage)
			.toHaveText(resultMessage, { timeout: Timeout.MEDIUM });
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
}
