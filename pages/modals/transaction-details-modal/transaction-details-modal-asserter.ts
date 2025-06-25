import { BaseAsserter } from "@base/base-asserter";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { expect } from "playwright/test";
import { step } from "decorators/step";

export class TransactionDetailsModalAsserter extends BaseAsserter<TransactionDetailsModal> {
	public constructor(page: TransactionDetailsModal) {
		super(page);
	}

	@step("Assert deposit amount in btc")
	public async assertDepositAmountInBTC(
		expectedValue: number,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getDepositAmountInBTCValue();
		expect(parseFloat(actualValue)).toBe(expectedValue);
	}
}
