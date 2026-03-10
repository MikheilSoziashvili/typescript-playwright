import { expect } from "@playwright/test";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { IntervalMs } from "@enums/interval-millisecond";
import { HiloBetTestData } from "@dtos/test-data";
import { HiloGameResultColor } from "@enums/hilo-result-messages";
import { logger } from "@logger/logger";
import { HiloGamePage } from "./hilo-game-page";

export class HiloGamePageSteps extends BasePageStep<HiloGamePage> {
	public constructor(gamdomPage: HiloGamePage) {
		super(gamdomPage);
	}

	@step("Navigate to Hilo and wait for betting window")
	public async navigateAndWaitForBettingWindow(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.waitBettingWindowAvailable();
	}

	@step("Place bet and wait for round result")
	public async placeBetAndWaitForResult(
		testData: HiloBetTestData,
	): Promise<string> {
		await this.gamdomPage.placeBet(testData.betAmount, testData.betOption);
		await this.gamdomPage
			.assertThat()
			.betIsPlaced(testData.username, testData.betAmount);
		return this.gamdomPage.getRoundResult();
	}

	@step("Play until result color is achieved")
	public async playUntilResultColorIs(
		resultColor: HiloGameResultColor,
		testData: HiloBetTestData,
	): Promise<number> {
		await this.navigateAndWaitForBettingWindow();

		let isWin = false;
		let accountBalance: number;

		do {
			accountBalance =
				await this.userBalanceHandler.walletBalanceInFiatRounded();

			const roundResult = await this.placeBetAndWaitForResult(testData);
			logger.info(`Current round result: ${roundResult}`);

			isWin = roundResult.includes(resultColor);
			if (!isWin) {
				logger.info("Hilo game lost! Trying again...");
			}
		} while (!isWin);

		return accountBalance;
	}

	@step("Assert account balance is correct after a win")
	public async assertBalanceAfterWin(
		balanceBeforeWin: number,
		testData: HiloBetTestData,
	): Promise<void> {
		const expectedBalance =
			balanceBeforeWin -
			testData.betAmount +
			this.gamdomPage.calculateProfit(
				testData.betAmount,
				testData.betMultiplierByBetOption,
			);

		await expect
			.poll(
				async () =>
					this.userBalanceHandler.walletBalanceInFiatRounded(),
				{
					message: `Account balance should be ${expectedBalance}`,
					intervals: [IntervalMs.NORMAL],
					timeout: Timeout.LONG,
				},
			)
			.toBe(expectedBalance);
	}
}
