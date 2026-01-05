import { BaseAsserter } from "@base/base-asserter";
import { BookOfPyramidsPage } from "./book-of-pyramids-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";

export class BookOfPyramidsPageAsserter extends BaseAsserter<BookOfPyramidsPage> {
	public constructor(page: BookOfPyramidsPage) {
		super(page);
	}

	@step("Verify balance after bet")
	public async balanceAfterBetIsCorrect(
		before: number,
		after: number,
		betAmount: number,
		won: boolean,
		winAmount: number,
	): Promise<void> {
		let expected = before - betAmount;

		if (won) {
			expected += winAmount;
		}

		await this.verifyBalance(after, expected);
	}

	@step("Check spin button is displayed")
	public async spinButtonIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.launcherIframeElement],
			Timeout.LONG,
			"Launcher iframe is not displayed. Game is not yet loaded.",
		);
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.spinButton],
			Timeout.LONG,
			"Spin button is not displayed. Game is not yet loaded.",
		);
	}
}
