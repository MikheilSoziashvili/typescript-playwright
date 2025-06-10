import { roundToDecimals, truncateToDecimals } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { BaseAsserter } from "@pages/base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { MinesGamePage } from "./mines-game-page";

export class MinesGamePageAsserter extends BaseAsserter<MinesGamePage> {
	public constructor(page: MinesGamePage) {
		super(page);
	}

	@step("Manual cashout button is displayed")
	async manualCashoutButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.manualCashoutButton).toBeVisible();
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

	@step("Start playing button is displayed")
	async startPlayingButtonIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.startPlayingButton).toBeVisible();
	}

	@step("Insert bet field is displayed")
	async insertBetFieldIsDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.betField).toBeVisible();
	}

	@step("Pick random tile button is not displayed")
	async pickRandomTileButtonIsNotDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.pickRandomTileButton).toBeHidden();
	}
}
