import { BasePageStep } from "../../core/helpers/base-page-step";
import { DiceBetTestData } from "../../dtos/test-data";
import { DiceGameResultMessage } from "../../enums/dice-result-messages";
import { logger } from "../../logger/logger";
import { HomePage } from "../home-page/home-page";
import { DiceGamePage } from "./dice-game-page";

export class DiceGamePageSteps extends BasePageStep<DiceGamePage> {
	public constructor(gamdomPage: DiceGamePage) {
		super(gamdomPage);
	}

	public async playUntilResultMesssageIs(
		gameResultMessage: DiceGameResultMessage,
		diceBetData: DiceBetTestData,
		homePage: HomePage,
	): Promise<void> {
		let isWin = false;

		while (!isWin) {
			const accountBalanceBeforeBet = await homePage.getAccountBalance();

			await this.gamdomPage.fillInBetData(
				diceBetData.betAmount,
				diceBetData.multiplier,
			);

			await this.gamdomPage
				.assertThat()
				.betValuesAreCorrect("34.000000", "1.50", "66.00", "0.50");
			await this.gamdomPage.assertThat().diceValueIsCorrect("34.00");

			await this.gamdomPage.rollDice();

			await this.gamdomPage.assertThat().diceMessageIsNotEmpty();
			await this.gamdomPage.assertThat().diceResultIsDisplayed();

			const diceGameAreaMessage =
				await this.gamdomPage.map.diceGameAreaMessage.textContent();
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
