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

export class DiceGamePageSteps extends BasePageStep<DiceGamePage> {
	public constructor(gamdomPage: DiceGamePage) {
		super(gamdomPage);
	}

	@step("Play until result message is achieved")
	public async playUntilResultMessageIs(
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

	@step("Roll dice")
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
}
