import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { BetTestData } from "@dtos/test-data";
import { CrashGamePage } from "./crash-game-page";
import { Timeout } from "@enums/timeout";
import { parseToFloat } from "@core/utils/utils";
import {
	BetIncreaseCondition,
	CrashBetItemStatus,
} from "@enums/crash-autobet-section";
import { IntervalMs } from "@enums/interval-millisecond";
import { sanitizeAmount } from "@support/regex-patterns";

export class CrashGamePageAsserter extends BaseAsserter<CrashGamePage> {
	public constructor(page: CrashGamePage) {
		super(page);
	}

	@step("Check player bets are accepted")
	public async playerBetsAccepted(
		bets: {
			username: string;
			betAmount: number;
		}[],
	): Promise<void> {
		for (const bet of bets) {
			const row = this.gamdomPage.map.statsTableBody.filter({
				hasText: bet.username,
			});
			await expect(row).toBeVisible({ timeout: Timeout.EXTRA_MAX });
			await expect
				.poll(async () => {
					const rawText = await row.textContent();
					return rawText?.replace(sanitizeAmount, "");
				})
				.toContain(bet.betAmount.toFixed(2));
		}
	}

	@step("Check bet box is displayed with correct amount")
	public async betBoxDisplayed(betAmount: number): Promise<void> {
		await expect
			.poll(async () => {
				const rawValue =
					await this.gamdomPage.map.betItemYourBetInput.inputValue();
				return rawValue.replace(sanitizeAmount, "");
			})
			.toBe(betAmount.toFixed(2));
	}

	@step("Wait for bet box to be absent")
	public async waitBetBoxAbsent(timeout: number): Promise<void> {
		await expect(this.gamdomPage.map.betBox).toBeAttached({
			attached: false,
			timeout: timeout,
		});
	}

	@step("Check expected and actual winnings match")
	public async isExpectedAndActualWinningMatch(
		expectedWinnings: number,
		actualWinnings: number,
	): Promise<void> {
		await this.checkStringElementsAreEqual(
			[expectedWinnings.toString()],
			[actualWinnings.toString()],
		);
	}

	@step("Check potential win is displayed")
	public async potentialWinDisplayed(potentialWin: number): Promise<void> {
		await expect
			.poll(async () => {
				const rawText =
					await this.gamdomPage.map.betItemPotential.textContent();
				return rawText?.replace(sanitizeAmount, "");
			})
			.toContain(parseToFloat(potentialWin));
	}

	@step("Check bet item button displays success")
	public async betWonSuccess(): Promise<void> {
		await expect(this.gamdomPage.map.betItemButton).toContainText(
			CrashBetItemStatus.SUCCESS,
		);
	}

	@step("Check paid out amount is displayed")
	public async paidOutDisplayed(paidOutAmount: number): Promise<void> {
		await expect(this.gamdomPage.map.betItemPotential).toContainText(
			CrashBetItemStatus.PAID_OUT,
		);
		await expect
			.poll(async () => {
				const rawText =
					await this.gamdomPage.map.betItemPotential.textContent();
				return rawText?.replace(sanitizeAmount, "");
			})
			.toContain(parseToFloat(paidOutAmount));
	}

	@step("Assert bet registration")
	public async betIsRegistered(
		betTestData: BetTestData,
		balanceBefore: number,
	): Promise<void> {
		await this.playerBetsAccepted([
			{
				username: betTestData.username,
				betAmount: betTestData.betAmount,
			},
		]);
		await this.betBoxDisplayed(betTestData.betAmount);

		const potentialWin = this.gamdomPage.calculateWinnings(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);
		await this.potentialWinDisplayed(potentialWin);

		await expect
			.poll(
				async () =>
					this.userBalanceHandler.walletBalanceInFiatRounded(),
				{
					message: `Balance should decrease by ${betTestData.betAmount} after placing bet`,
					intervals: [IntervalMs.NORMAL],
					timeout: Timeout.SHORT,
				},
			)
			.toBe(balanceBefore - betTestData.betAmount);
	}

	@step("Assert account balance is correct after play")
	public async balanceAfterWinIsCorrect(
		accountBalanceBeforePlay: number,
		totalBetsPlaced: number,
		winnings: number,
	): Promise<void> {
		const expectedBalance = this.gamdomPage.calculateExpectedBalance(
			accountBalanceBeforePlay,
			totalBetsPlaced,
			winnings,
		);
		await expect
			.poll(
				async () =>
					this.userBalanceHandler.walletBalanceInFiatRounded(),
				{
					message: `Account balance should settle at ${expectedBalance} after payout`,
					intervals: [IntervalMs.NORMAL],
					timeout: Timeout.LONG,
				},
			)
			.toBe(expectedBalance);
	}

	@step("Check start autobet button is enabled")
	public async startAutobetButtonIsEnabled(): Promise<void> {
		await expect(this.gamdomPage.map.autoPlayBtn).toBeEnabled();
		await expect(this.gamdomPage.map.autoPlayBtn).toHaveText(
			"Start auto bet",
		);
	}

	@step("Verify balance is correct")
	public async verifyBalance(
		actualBalance: number,
		expectedBalance: number,
	): Promise<void> {
		expect(actualBalance).toBe(expectedBalance);
	}

	@step("Verify bet amount remains at base")
	public async betAmountIsAtBase(baseBetAmount: number): Promise<void> {
		await expect
			.poll(() => this.gamdomPage.getCurrentBetAmount(), {
				timeout: Timeout.SHORT,
				intervals: [IntervalMs.SHORT],
				message: `Bet amount should remain at base: ${baseBetAmount}`,
			})
			.toEqual(baseBetAmount);
	}

	@step("Verify bet amount updated correctly")
	public async verifyBetAmountUpdatedCorrectly(
		previousBetAmount: number,
		betWon: boolean,
		increaseCondition: BetIncreaseCondition,
		increaseByMultiplier: number,
		baseBetAmount: number,
	): Promise<number> {
		const currentBetAmount = await this.gamdomPage.getCurrentBetAmount();

		let expectedBetAmount: number;

		if (
			(increaseCondition === BetIncreaseCondition.WIN && betWon) ||
			(increaseCondition === BetIncreaseCondition.LOSS && !betWon)
		) {
			expectedBetAmount = parseFloat(
				(previousBetAmount * (1 + increaseByMultiplier / 100)).toFixed(
					2,
				),
			);
		} else {
			expectedBetAmount = baseBetAmount;
		}

		await expect
			.poll(() => this.gamdomPage.getCurrentBetAmount(), {
				timeout: Timeout.SHORT,
				intervals: [IntervalMs.SHORT],
				message: `Bet amount should be ${expectedBetAmount}`,
			})
			.toEqual(expectedBetAmount);

		return currentBetAmount;
	}
}
