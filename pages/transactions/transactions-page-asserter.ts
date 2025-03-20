import { BaseAsserter } from "@pages/base/base-asserter";
import { TransactionsPage } from "./transactions-page";
import { expect } from "playwright/test";
import { step } from "decorators/step";

export class TransactionsAsserter extends BaseAsserter<TransactionsPage> {
	public constructor(page: TransactionsPage) {
		super(page);
	}

	@step()
	public async assertTransactionStatusIsComplete(): Promise<void> {
		const finalStatus =
			await this.gamdomPage.waitForTransactionStatusToComplete();
		expect(finalStatus).toBe("Complete");
	}
}
