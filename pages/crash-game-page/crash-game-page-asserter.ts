import { Locator, expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { CrashGamePage } from "./crash-game-page";
import { Timeout } from "@enums/timeout";
import { formatCurrency, parseToFloat } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";
import { Locale } from "@enums/locale";
import { Currency } from "@enums/currencies";

export class CrashGamePageAsserter extends BaseAsserter<CrashGamePage> {
	public constructor(page: CrashGamePage) {
		super(page);
	}

	public async playerBetsAccepted(
		bets: {
			username: string;
			betAmount: string;
		}[],
	): Promise<void> {
		for (const bet of bets as { username: string; betAmount: string }[]) {
			const formattedAmount = formatCurrency(
				Number(bet.betAmount),
				Locale.EN_US,
				Currency.USD,
			);

			await expect(this.gamdomPage.map.playersGridRowCells).toContainText(
				[bet.username, formattedAmount],
				{ timeout: Timeout.EXTRA_MAX },
			);
		}
	}

	public async playerBetBoxesDisplayed(
		bets: { betAmount: string }[],
	): Promise<void> {
		let betBoxes: Locator[] = [];

		await expect(async () => {
			betBoxes = await this.gamdomPage.map.betBoxes;
			expect(betBoxes).toHaveLength(bets.length);
		}).toPass({
			timeout: Timeout.SHORT,
			intervals: [300],
		});

		for (const bet of bets) {
			for (const betBox of betBoxes) {
				await expect(
					this.gamdomPage.map.betBoxBetAmount(betBox),
				).toHaveAttribute(Attributes.VALUE, bet.betAmount);
			}
		}
	}

	public async waitPlayerBetBoxesAbsent(timeout: number): Promise<void> {
		const betBoxes: Locator[] = await this.gamdomPage.map.betBoxes;
		for (const betBox of betBoxes) {
			await expect(betBox).toBeAttached({
				attached: false,
				timeout: timeout,
			});
		}
	}

	public async isExpectedAndActualWinningMatch(
		expectedWinnings: number,
		actualWinnings: number,
	): Promise<void> {
		await this.checkStringElementsAreEqual(
			[expectedWinnings.toString()],
			[actualWinnings.toString()],
		);
	}

	public async potentialWinDisplayed(potentialWin: number): Promise<void> {
		await expect(this.gamdomPage.map.potentialWinAmount).toContainText(
			`$${parseToFloat(potentialWin)}`,
		);
	}

	public async startAutobetButtonIsEnabled(): Promise<void> {
		await expect(this.gamdomPage.map.placeBetBtn).toBeEnabled();
		await expect(this.gamdomPage.map.placeBetBtn).toHaveText(
			"Start Autobet",
		);
	}

	public async betAmountIsEqualTo(betAmount: number): Promise<void> {
		const amount = this.gamdomPage.getCurrentBetAmount();
		expect(betAmount).toEqual(amount);
	}

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
			expectedBetAmount = previousBetAmount * increaseByMultiplier;
		} else {
			expectedBetAmount = baseBetAmount;
		}

		expect(currentBetAmount).toEqual(expectedBetAmount);

		return currentBetAmount;
	}
}
