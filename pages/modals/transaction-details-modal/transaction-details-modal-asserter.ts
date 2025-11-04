import { BaseAsserter } from "@base/base-asserter";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { CryptoTicker } from "@enums/cryptocurrencies";

export class TransactionDetailsModalAsserter extends BaseAsserter<TransactionDetailsModal> {
	public constructor(page: TransactionDetailsModal) {
		super(page);
	}

	@step("Assert deposit amount for specified currency")
	public async assertDepositAmountIn(
		crypto: CryptoTicker,
		expectedValue: number,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getDepositAmountInCryptoValue(
			crypto,
		);
		expect(parseFloat(actualValue)).toBe(expectedValue);
	}
}
