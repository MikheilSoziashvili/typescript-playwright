import { Locator, expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { CrashGamePage } from "./crash-game-page";
import { Timeout } from "@enums/timeout";
import { parseToFloat } from "@core/utils/utils";

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
			await expect(this.gamdomPage.map.playersGridRowCells).toContainText(
				[bet.username, bet.betAmount],
				{ timeout: Timeout.LONG },
			);
		}
	}

	public async playerBetBoxesDisplayed(
		bets: {
			betAmount: string;
		}[],
	): Promise<void> {
		const betBoxes: Locator[] = await this.gamdomPage.map.betBoxes;
		expect(betBoxes).toHaveLength(bets.length);
		for (const bet of bets as { betAmount: string }[]) {
			for (const betBox of betBoxes) {
				await expect(
					this.gamdomPage.map.betBoxBetAmount(betBox),
				).toHaveAttribute("value", bet.betAmount);
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
}
