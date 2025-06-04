import { roundToDecimals, truncateToDecimals } from "@core/utils/utils";
import { BaseAsserter } from "@pages/base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { MinesGamePage } from "./mines-game-page";
import { logger } from "@logger/logger";

export class MinesGamePageAsserter extends BaseAsserter<MinesGamePage> {
	public constructor(page: MinesGamePage) {
		super(page);
	}

	@step("Win image is displayed")
	async winImageIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.winImage).toBeVisible();
	}

	@step("Account balance is correct after win")
	public async accountBalanceAfterGameFlowIsCorrect({
		accountBalanceBeforeBet,
		betAmount,
		totalBetsPlaced,
		cashoutMultiplier,
		numberOfWins,
	}: {
		accountBalanceBeforeBet: number;
		betAmount: number;
		totalBetsPlaced: number;
		cashoutMultiplier: number;
		numberOfWins: number;
	}): Promise<void> {
		const winnings = this.gamdomPage.calculateWinnings(
			betAmount * numberOfWins,
			cashoutMultiplier,
		);

		const expectedBalance = this.gamdomPage.calculateExpectedBalance(
			accountBalanceBeforeBet,
			totalBetsPlaced,
			winnings,
		);
		logger.info(`Winnings calculated: ${winnings}`);
		await this.assertBalanceMatches(expectedBalance);
	}

	private async assertBalanceMatches(expected: number): Promise<void> {
		await this.gamdomPage.map.waitForStableXPosition({
			locator:
				await this.gamdomPage.authenticatedHeader.map.getLoadedAccountBalance(),
		});
		const actual = roundToDecimals(
			await this.gamdomPage.authenticatedHeader.getAccountBalance(),
		);
		const actualTruncated = truncateToDecimals(actual, 1);
		const expectedTruncated = truncateToDecimals(
			roundToDecimals(expected, 2),
			1,
		);

		logger.info(
			`Wallet balance: ${actualTruncated} = Expected: ${expectedTruncated}`,
		);

		expect(actualTruncated).toEqual(expectedTruncated);
	}
}
