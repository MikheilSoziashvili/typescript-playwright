import { BaseAsserter } from "@base/base-asserter";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { sanitizeAmount } from "@support/regex-patterns";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";

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

	@step("Assert withdrawal amount in USD")
	public async withdrawalAmountInUsdIs(expectedValue: number): Promise<void> {
		const actualValue = await this.gamdomPage.getWithdrawalAmountInUsd();
		const cleanedValue = actualValue.replace(sanitizeAmount, "");
		expect(parseFloat(cleanedValue)).toBeCloseTo(expectedValue, 2);
	}

	@step("Assert network transaction fee amount")
	public async networkTransactionFeeAmountIs(
		expectedValue: string,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getNetworkTransactionFee();
		const cleanedValue = actualValue.replace(sanitizeAmount, "");
		expect(parseFloat(cleanedValue)).toBe(parseFloat(expectedValue));
	}

	@step("Assert network transaction speed")
	public async networkTransactionSpeedIs(
		expectedValue: string,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getNetworkTransactionSpeed();
		expect(actualValue).toBe(expectedValue);
	}

	@step("Assert withdrawal details")
	public async withdrawalTransactionDetailsAre(
		amountInUsd: number,
		networkFee: string,
		transactionSpeed: string,
		isVip: boolean,
	): Promise<void> {
		await this.withdrawalAmountInUsdIs(amountInUsd);
		if (!isVip && transactionSpeed === WithdrawalSpeed.Standard) {
			await this.networkTransactionFeeAmountIs(networkFee);
		}
		await this.networkTransactionSpeedIs(transactionSpeed);
	}
}
