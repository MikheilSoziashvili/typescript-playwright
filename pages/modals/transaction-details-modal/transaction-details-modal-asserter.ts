import { BaseAsserter } from "@base/base-asserter";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { sanitizeAmount } from "@support/regex-patterns";
import { WithdrawalSpeed } from "@enums/withdrawal-speeds";
import { formatNumber } from "@core/utils/utils";

export class TransactionDetailsModalAsserter extends BaseAsserter<TransactionDetailsModal> {
	public constructor(page: TransactionDetailsModal) {
		super(page);
	}

	@step("Assert deposit amount for specified currency")
	public async assertDepositAmountIn(
		crypto: CryptoTicker,
		expectedValue: number,
	): Promise<void> {
		const actualValue =
			await this.gamdomPage.getDepositAmountInCryptoValue(crypto);
		expect(parseFloat(actualValue)).toBe(expectedValue);
	}

	@step("Assert withdrawal amount in USD")
	public async withdrawalAmountInUsdIs(expectedValue: number): Promise<void> {
		const actualValue = await this.gamdomPage.getWithdrawalAmountInUsd();
		const actual = Number(actualValue.replace(sanitizeAmount, ""));

		expect(formatNumber(actual)).toBe(formatNumber(expectedValue));
	}

	@step("Assert network transaction fee amount")
	public async networkTransactionFeeAmountIs(
		expectedValue: string,
	): Promise<void> {
		const actualValue = await this.gamdomPage.getNetworkTransactionFee();

		const actual = Number(actualValue.replace(sanitizeAmount, ""));
		const expected = Number(expectedValue);

		expect(formatNumber(actual)).toBe(formatNumber(expected));
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
		isVip: boolean,
		transactionSpeed: string,
	): Promise<void> {
		await this.withdrawalAmountInUsdIs(amountInUsd);

		const shouldSkipFeeCheck =
			(isVip && transactionSpeed === WithdrawalSpeed.Standard) ||
			Number(networkFee) === 0;

		if (!shouldSkipFeeCheck) {
			await this.networkTransactionFeeAmountIs(networkFee);
		}

		await this.networkTransactionSpeedIs(transactionSpeed);
	}
}
