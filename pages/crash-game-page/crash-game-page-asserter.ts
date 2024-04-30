import { Locator, expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { CrashGamePage } from "./crash-game-page";

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
			await expect
				.soft(this.gamdomPage.map.playersGridRowCells)
				.toContainText([bet.username, bet.betAmount]);
		}
	}

	public async playerBetBoxesDisplayed(
		bets: {
			betAmount: string;
		}[],
	): Promise<void> {
		const betBoxes: Locator[] = await this.gamdomPage.map.betBoxes;
		expect.soft(betBoxes).toHaveLength(bets.length);
		for (const bet of bets as { betAmount: string }[]) {
			for (const betBox of betBoxes) {
				await expect
					.soft(this.gamdomPage.map.betBoxBetAmount(betBox))
					.toHaveAttribute("value", bet.betAmount);
			}
		}
	}
}
