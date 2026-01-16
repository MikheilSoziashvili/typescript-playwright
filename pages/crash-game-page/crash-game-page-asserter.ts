import { Locator, expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { CrashGamePage } from "./crash-game-page";
import { Timeout } from "@enums/timeout";
import { formatCurrency, parseToFloat } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";
import { Locale } from "@enums/locale";
import { Currency } from "@enums/currencies";
import { IntervalMs } from "@enums/interval-millisecond";

export class CrashGamePageAsserter extends BaseAsserter<CrashGamePage> {
	public constructor(page: CrashGamePage) {
		super(page);
	}

	@step("Check player bets are accepted")
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

	@step("Check player bet boxes are displayed")
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

	@step("Wait for player bet boxes to be absent")
	public async waitPlayerBetBoxesAbsent(timeout: number): Promise<void> {
		const betBoxes: Locator[] = await this.gamdomPage.map.betBoxes;
		for (const betBox of betBoxes) {
			await expect(betBox).toBeAttached({
				attached: false,
				timeout: timeout,
			});
		}
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
		await expect(this.gamdomPage.map.potentialWinAmount).toContainText(
			`$${parseToFloat(potentialWin)}`,
		);
	}

	@step("Check start autobet button is enabled")
	public async startAutobetButtonIsEnabled(): Promise<void> {
		await expect(this.gamdomPage.map.placeBetBtn).toBeEnabled();
		await expect(this.gamdomPage.map.placeBetBtn).toHaveText(
			"Start Autobet",
		);
	}

	@step("Check bet amount is equal to expected")
	public async betAmountIsEqualTo(betAmount: number): Promise<void> {
		const amount = this.gamdomPage.getCurrentBetAmount();
		expect(betAmount).toEqual(amount);
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
			expectedBetAmount = previousBetAmount * increaseByMultiplier;
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

	@step("Wait for player bet boxes to be absent - v4")
	public async waitPlayerBetBoxesAbsentV4(timeout: number): Promise<void> {
		const betBoxes = this.gamdomPage.map.betBoxesV4;
		await expect(betBoxes).toBeAttached({
			attached: false,
			timeout: timeout,
		});
	}
}
