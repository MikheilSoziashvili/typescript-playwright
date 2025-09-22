import { BaseAsserter } from "@base/base-asserter";
import { BookOfPyramidsPage } from "./book-of-pyramids-page";
import { step } from "decorators/step";

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
}
