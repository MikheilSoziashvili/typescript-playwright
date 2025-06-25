import { BaseAsserter } from "@pages/base/base-asserter";
import { TransactionsPage } from "./transactions-page";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { TransactionState } from "@enums/transaction-states";

export class TransactionsAsserter extends BaseAsserter<TransactionsPage> {
	public constructor(page: TransactionsPage) {
		super(page);
	}

	@step("Assert transaction status is")
	public async assertTransactionStatusIs(
		expectedStatus: TransactionState,
	): Promise<void> {
		const finalStatus = await this.gamdomPage.waitForTransactionStatus(
			expectedStatus,
		);
		expect(finalStatus).toBe(expectedStatus);
	}
}
