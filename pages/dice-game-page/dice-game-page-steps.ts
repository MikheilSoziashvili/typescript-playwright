import { BasePageStep } from "@pages/base/base-page-step";
import { DiceAutobetTestData, DiceBetTestData } from "@dtos/test-data";
import { DiceGameResultMessage } from "@enums/dice-result-messages";
import { logger } from "@logger/logger";
import { DiceGamePage } from "./dice-game-page";
import { parseToFloat, waitUntil } from "@core/utils/utils";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";

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

	public async autobetIncreaseBy(
		gameResultMessage: DiceGameResultMessage,
		diceBetData: DiceAutobetTestData,
		type: BetIncreaseCondition,
		increaseBy: number,
	): Promise<void> {
		while (!(await this.isWinningConditionMet(gameResultMessage))) {
			await this.prepareAutobetRound(diceBetData, type, increaseBy);
			await this.waitForAutobetRoundToFinish();
		}
	}

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

	private async waitForAutobetRoundToFinish(): Promise<void> {
		await waitUntil(
			async () => {
				const textContent =
					await this.gamdomPage.map.diceGameAreaMessage.textContent();
				return !textContent?.includes("Rolling");
			},
			{
				errorMessage: "Dice never finished rolling within the timeout.",
				intervalSeconds: 1,
				timeoutSeconds: 5,
			},
		);

		await this.gamdomPage.assertThat().diceMessageIsNotEmpty();
		await this.gamdomPage.assertThat().diceResultIsDisplayed();
	}

	private async isWinningConditionMet(
		gameResultMessage: DiceGameResultMessage,
	): Promise<boolean> {
		const diceGameAreaMessage =
			await this.gamdomPage.map.diceGameAreaMessage.textContent();
		return diceGameAreaMessage === gameResultMessage;
	}
}
