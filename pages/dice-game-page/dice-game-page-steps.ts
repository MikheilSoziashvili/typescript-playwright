import { BasePageStep } from "@pages/base/base-page-step";
import { DiceAutobetTestData, DiceBetTestData } from "@dtos/test-data";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { logger } from "@logger/logger";
import { DiceGamePage } from "./dice-game-page";
import { parseToFloat } from "@core/utils";

export class DiceGamePageSteps extends BasePageStep<DiceGamePage> {
	public constructor(gamdomPage: DiceGamePage) {
		super(gamdomPage);
	}

	public async playUntilResultMesssageIs(
		gameResultMessage: DiceGameResultMessage,
		diceBetData: DiceBetTestData,
	): Promise<void> {
		let isWin = false;

		while (!isWin) {
			const accountBalanceBeforeBet =
				await this.gamdomPage.authenticatedHeader.getAccountBalance();

			await this.gamdomPage.fillInManualBetData(
				diceBetData.betAmount,
				diceBetData.multiplier,
			);
			// TODO Need to refactor this part. If we change the multiplier, this values are not correct anymore
			await this.gamdomPage
				.assertThat()
				.manualBetValueAreCorrect("34.000000", "1.50", "66.00", "0.50");
			await this.gamdomPage
				.assertThat()
				.diceSliderValueIsCorrect("34.00");

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
				await this.gamdomPage.authenticatedHeader
					.assertThat()
					.accountBalanceIs(expectedBalance);
			}

			if (!isWin) {
				logger.info("Dice game lost! Rolling dice again...");
			}
		}
	}

	public async rollDice(diceBetData: DiceBetTestData): Promise<void> {
		await this.gamdomPage.fillInManualBetData(diceBetData.betAmount);
		const multiplier = diceBetData.multiplier || 1;
		await this.gamdomPage
			.assertThat()
			.manualBetAndProfitOnWinValuesAreCorrect(
				diceBetData.betAmount,
				diceBetData.betAmount * multiplier,
			);
		await this.gamdomPage.rollDice();
	}

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
}
