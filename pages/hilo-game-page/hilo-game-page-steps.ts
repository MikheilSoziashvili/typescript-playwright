import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { HiloBetTestData } from "@dtos/test-data";
import { HiloGameResultColor } from "@enums/hilo-result-messages";
import { logger } from "@logger/logger";
import { parseToFloat } from "@core/utils/utils";
import { HiloGamePage } from "./hilo-game-page";

export class HiloGamePageSteps extends BasePageStep<HiloGamePage> {
	public constructor(gamdomPage: HiloGamePage) {
		super(gamdomPage);
	}

	@step("Navigate to Hilo and verify countdown is visible")
	public async navigateAndWaitForBettingWindow(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().countdownIsVisible();
		await this.gamdomPage.waitBettingWindowAvailable();
	}

	@step("Enter bet amount and verify bet options are enabled")
	public async enterBetAndVerifyBetOptions(
		testData: HiloBetTestData,
	): Promise<void> {
		await this.gamdomPage.fillInBetAmount(testData.betAmount);
		await this.gamdomPage
			.assertThat()
			.yourBetFieldHasValue(parseToFloat(testData.betAmount));
		await this.gamdomPage
			.assertThat()
			.betOptionButtonsAreEnabled(
				this.gamdomPage.getAlwaysEnabledBetButtons(),
			);
	}

	@step("Place bet and read round result")
	public async placeBetAndReadResult(
		testData: HiloBetTestData,
	): Promise<string> {
		await this.gamdomPage.waitBettingWindowAvailable();
		await this.enterBetAndVerifyBetOptions(testData);
		await this.gamdomPage.clickBetOption(testData.betOption);
		await this.gamdomPage
			.assertThat()
			.betIsPlaced(testData.username, testData.betAmount);
		await this.gamdomPage.waitRoundResult();
		return this.gamdomPage.map.gameResultLocator.innerText({
			timeout: Timeout.MEDIUM,
		});
	}

	@step("Play until result color is achieved")
	public async playUntilResultColorIs(
		resultColor: HiloGameResultColor,
		testData: HiloBetTestData,
	): Promise<number> {
		await this.navigateAndWaitForBettingWindow();

		let isWin = false;
		let balanceInCoins: number;

		do {
			balanceInCoins =
				await this.userBalanceHandler.walletBalanceInCoins();

			const roundResult = await this.placeBetAndReadResult(testData);
			logger.info(`Current round result: ${roundResult}`);

			isWin = roundResult.includes(resultColor);
			if (isWin) {
				await this.verifyWinPayoutAndHistory(testData);
			} else {
				logger.info("Hilo game lost! Trying again...");
			}
		} while (!isWin);

		return balanceInCoins;
	}

	@step("Assert account balance in coins is correct after a win")
	public async assertBalanceAfterWin(
		balanceBeforeWinInCoins: number,
		testData: HiloBetTestData,
	): Promise<void> {
		const betCoins = this.userBalanceHandler.usdToCoinsTrunc(
			testData.betAmount,
		);
		const payoutCoins = this.userBalanceHandler.calculatePayoutCoins(
			betCoins,
			testData.betMultiplierByBetOption,
		);
		const expectedCoins = balanceBeforeWinInCoins - betCoins + payoutCoins;

		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceInCoinsIs(expectedCoins);
	}

	@step("Verify win payout and history card")
	public async verifyWinPayoutAndHistory(
		testData: HiloBetTestData,
	): Promise<void> {
		const payoutAmount = `+${parseToFloat(
			this.gamdomPage.calculateProfit(
				testData.betAmount,
				testData.betMultiplierByBetOption,
			),
		)}`;
		await this.gamdomPage
			.assertThat()
			.payoutIsDisplayed(testData.username, payoutAmount);
		await this.gamdomPage.assertThat().historyCardsAreVisible();
	}
}
