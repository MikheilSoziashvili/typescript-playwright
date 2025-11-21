import { BasePageStep } from "@pages/base/base-page-step";
import { PocketDicePage } from "./pocket-dice-page";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { calculateBetAmountWithPercentage } from "@formulas/betting-calculations";
import { expect } from "@playwright/test";

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
			await this.gamdomPage.map.startAutobetButton.click();
			await this.gamdomPage.assertThat().startPlayingButtonEnabled();

			const isWin = await this.gamdomPage.assertThat().isWinDetected();

			if (isWin && !hasWin) {
				logger.info("First win detected");
				hasWin = true;
			} else if (!isWin && !hasLoss) {
				logger.info("First loss detected");
				hasLoss = true;
			}

			if (hasWin || hasLoss) {
				currentBet = await this.updateBetAmount(
					currentBet,
					isWin,
					onWinPercentage,
					onLossPercentage,
				);
			}
		}
	}

	@step("Update bet amount based on win/loss")
	private async updateBetAmount(
		currentBet: number,
		isWin: boolean,
		onWinPercentage: number,
		onLossPercentage: number,
	): Promise<number> {
		const percentage = isWin ? onWinPercentage : onLossPercentage;
		return this.verifyBetAmountIncreasedBy(currentBet, percentage);
	}
}
