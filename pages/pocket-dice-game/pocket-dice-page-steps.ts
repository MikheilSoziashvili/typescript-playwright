import { BasePageStep } from "@pages/base/base-page-step";
import { PocketDicePage } from "./pocket-dice-page";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { calculateBetAmountWithPercentage } from "@formulas/betting-calculations";
import { expect } from "@playwright/test";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { VisibilityState } from "@enums/playwright/visibility-states";
import { Timeout } from "@enums/timeout";

export class PocketDiceSteps extends BasePageStep<PocketDicePage> {
	public constructor(page: PocketDicePage) {
		super(page);
	}

	@step("Navigate and wait for game to load")
	public async navigateAndWaitForGameToLoad(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().rollDiceButtonVisible();
	}

	@step("Verify bet amount increased by percentage")
	public async verifyBetAmountIncreasedBy(
		previousBet: number,
		percentage: number,
	): Promise<number> {
		const actualBet = await this.gamdomPage.getBetAmountInputValue();
		const expectedBet = calculateBetAmountWithPercentage(
			previousBet,
			percentage,
		);
		expect(actualBet).toBeCloseTo(expectedBet, 1);
		return actualBet;
	}

	@step("Play autobet rounds until win and loss detected")
	public async playAutobetUntilWinAndLoss(
		betAmount: number,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<void> {
		let hasWin = false;
		let hasLoss = false;
		let currentBet = betAmount;

		while (!hasWin || !hasLoss) {
			logger.info(`Current bet amount before round: ${currentBet}`);
			const isWinBannerDisplayed = this.waitForWinBanner();

			await this.gamdomPage.map.startAutobetButton.click();
			const isWin = await isWinBannerDisplayed;
			await this.gamdomPage.assertThat().startPlayingButtonEnabled();

			logger.info(`Win banner detected: ${isWin}`);

			if (isWin && !hasWin) {
				logger.info("First win detected");
				hasWin = true;
				currentBet = await this.updateAndVerifyBetAmount(
					currentBet,
					onWinPercentage,
				);
			} else if (!isWin && !hasLoss) {
				logger.info("First loss detected");
				hasLoss = true;
				currentBet = await this.updateAndVerifyBetAmount(
					currentBet,
					onLossPercentage,
				);
			} else {
				currentBet = await this.waitForBetAmountChange(currentBet);
			}

			logger.info(`Updated bet amount: ${currentBet}`);
		}
	}

	@step("Wait for win banner to appear")
	private async waitForWinBanner(): Promise<boolean> {
		try {
			await this.gamdomPage.map.winBanner.waitFor({
				state: VisibilityState.ATTACHED,
				timeout: Timeout.SHORT,
			});
			return true;
		} catch {
			return false;
		}
	}

	@step("Wait for bet amount to change")
	private async waitForBetAmountChange(currentBet: number): Promise<number> {
		await waitUntil(
			async () => {
				const value = await this.gamdomPage.getBetAmountInputValue();
				return currentBet !== value;
			},
			{
				errorMessage: `Bet amount did not change from ${currentBet}`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds: TimeoutSeconds.FIVE,
			},
		);
		return this.gamdomPage.getBetAmountInputValue();
	}

	@step("Update and verify bet amount")
	private async updateAndVerifyBetAmount(
		currentBet: number,
		percentage: number,
	): Promise<number> {
		await this.waitForBetAmountChange(currentBet);
		return this.verifyBetAmountIncreasedBy(currentBet, percentage);
	}
}
