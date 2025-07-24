import { roundToDecimals, truncateToDecimals } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { BaseAsserter } from "@pages/base/base-asserter";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { MinesGamePage } from "./mines-game-page";
import { Timeout } from "@enums/timeout";

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

	@step("Assert balance matches expected")
	private async assertBalanceMatches(expected: number): Promise<void> {
		await this.gamdomPage.map.waitForStableXPosition({
			locator:
				await this.gamdomPage.authenticatedHeader.map.getLoadedAccountBalance(),
		});

		const actual = await this.userBalanceHandler.walletBalanceInUsd();

		const actualTruncated = truncateToDecimals(actual);
		const expectedTruncated = truncateToDecimals(roundToDecimals(expected));

		logger.info(
			`Wallet balance: ${actualTruncated} = Expected: ${expectedTruncated}`,
		);

		expect(actualTruncated).toBeCloseTo(expectedTruncated);
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

	@step("Verify Game History modal is opened")
	async verifyGameHistoryModalIsOpened(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.gameHistoryModalContainer,
		]);
	}

	@step("Verify Bet details modal is opened")
	async verifyBetDetailsModalIsOpened(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.singleBetHistoryModal,
		]);
	}

	@step("Verify bet amount is displayed in bet details modal")
	async verifyBetAmountIsDisplayedInBetDetailsModal(
		expectedAmount: string,
	): Promise<void> {
		await expect(this.gamdomPage.map.betDetailsBetAmount).toHaveText(
			expectedAmount,
		);
	}

	@step("Verify bet amount in field")
	public async verifyBetAmountInField(expectedAmount: number): Promise<void> {
		await expect
			.poll(
				async () => {
					const actualBetAmount =
						await this.gamdomPage.getBetAmountValue();
					return parseFloat(actualBetAmount);
				},
				{
					message: `Expected bet amount in field to be ${expectedAmount}`,
					timeout: Timeout.SHORT,
					intervals: [Timeout.ULTRA_SHORT],
				},
			)
			.toBeCloseTo(expectedAmount, 1);
	}

	@step("Account balance is correct after autobet with percentage increase")
	public async accountBalanceAfterAutobetIsCorrect({
		accountBalanceBeforeBet,
		betAmountHistory,
		winningBets,
		cashoutMultiplier,
	}: {
		accountBalanceBeforeBet: number;
		betAmountHistory: number[];
		winningBets: number[];
		cashoutMultiplier: number;
	}): Promise<void> {
		const totalBetsDeducted = betAmountHistory.reduce(
			(sum, bet) => sum + bet,
			0,
		);

		const totalPayoutsFromWins = winningBets.reduce((sum, bet) => {
			const payoutAmount = this.gamdomPage.calculateWinnings(
				bet,
				cashoutMultiplier,
			);
			logger.info(`Winning bet ${bet} -> payout: ${payoutAmount}`);
			return sum + payoutAmount;
		}, 0);

		const expectedBalance =
			accountBalanceBeforeBet - totalBetsDeducted + totalPayoutsFromWins;
		const expectedBalanceRounded = roundToDecimals(expectedBalance);

		const currentBalance =
			await this.userBalanceHandler.walletBalanceInUsd();
		logger.info(`Current balance: ${currentBalance}`);
		logger.info(`Bet history: ${betAmountHistory.join(", ")}`);
		logger.info(`Winning bets: ${winningBets.join(", ")}`);
		logger.info(`Expected balance: ${expectedBalance}`);

		await this.assertBalanceMatches(expectedBalanceRounded);
	}
}
