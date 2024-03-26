import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { DiceGamePageMap } from "./dice-game-page-map";
import { DiceGamePageAsserter } from "./dice-game-page-asserter";
import { logger } from "../../logger/logger";
import { DiceGameResultMessage } from "../../enums/dice-result-messages";
import { DiceBetTestData } from "../../dtos/test-data";
import { HomePage } from "../home-page/home-page";

export class DiceGamePage extends BasePage<DiceGamePageMap> {
	public constructor(page: Page) {
		super(page, new DiceGamePageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto("/dice");
	}

	public override assertThat(): DiceGamePageAsserter {
		return new DiceGamePageAsserter(this);
	}

	public async fillInBetData(
		betAmount: number,
		multiplier?: number,
	): Promise<void> {
		await this.map.betField.fill(`${betAmount}`);
		multiplier !== undefined &&
			(await this.map.multiplierField.fill(`${multiplier}`));
	}

	public async rollDice(): Promise<void> {
		await this.map.rollDiceBtn.click();
	}

	public async playUntilResultMesssageIs(
		gameResultMessage: DiceGameResultMessage,
		diceBetData: DiceBetTestData,
		homePage: HomePage,
	): Promise<void> {
		let isWin = false;

		while (!isWin) {
			const accountBalanceBeforeBet = await homePage.getAccountBalance();

			await this.fillInBetData(
				diceBetData.betAmount,
				diceBetData.multiplier,
			);

			await this.assertThat().betValuesAreCorrect(
				"34.000000",
				"1.50",
				"66.00",
				"0.50",
			);
			await this.assertThat().diceValueIsCorrect("34.00");

			await this.rollDice();

			await this.assertThat().diceMessageIsNotEmpty();
			await this.assertThat().diceResultIsDisplayed();

			const diceGameAreaMessage =
				await this.map.diceGameAreaMessage.textContent();
			isWin = diceGameAreaMessage === gameResultMessage;

			if (diceBetData.multiplier != undefined) {
				const expectedBalance = isWin
					? accountBalanceBeforeBet +
					  diceBetData.betAmount * (diceBetData.multiplier - 1)
					: accountBalanceBeforeBet - diceBetData.betAmount;
				await homePage.assertThat().accountBalanceIs(expectedBalance);
			}

			if (!isWin) {
				logger.info("Dice game lost! Rolling dice again...");
			}
		}
	}
}
