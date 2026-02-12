import { BaseAsserter } from "@pages/base/base-asserter";
import { TransactionsPage } from "./transactions-page";
import { expect } from "playwright/test";
import { step } from "decorators/step";
import { TransactionState } from "@enums/transaction-states";
import { TransactionType } from "@enums/transaction-types";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class TransactionsAsserter extends BaseAsserter<TransactionsPage> {
	public constructor(page: TransactionsPage) {
		super(page);
	}

	@step("Assert transaction status is")
	public async assertTransactionStatusIs(
		expectedStatus: TransactionState,
		type: TransactionType,
		timeout?: TimeoutSeconds,
	): Promise<void> {
		const finalStatus = await this.gamdomPage.waitForTransactionStatus(
			expectedStatus,
			type,
			timeout,
		);
		expect(finalStatus).toBe(expectedStatus);
	}

	@step("Tip sent value is captured")
	public async tipSentValueIsCaptured(tipValue: number): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.tipAmount,
				expectedText: this.isTipAmountSent(tipValue, true),
			},
		]);
	}

	@step("Tip received value is captured")
	public async tipReceivedValueIsCaptured(tipValue: number): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.tipAmount,
				expectedText: this.isTipAmountSent(tipValue, false),
			},
		]);
	}

	@step("Tip sent and Success status are visible")
	public async tipSuccessStatusIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.successStatus,
		]);
	}

	@step("Received tip user is displayed in transaction details")
	public async receivedTipUserIsDisplayed(userName: string): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.receivedByValue,
				expectedValue: userName,
			},
		]);
	}

	@step("Sent tip user is displayed in transaction details")
	public async sentTipUserIsDisplayed(userName: string): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.sentByValue,
				expectedValue: userName,
			},
		]);
	}

	@step("Sent tip amount is displayed in transaction details")
	public async sentTipAmountIsDisplayed(amount: number): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.amountValue,
				expectedValue: this.isTipAmountSent(amount, true),
			},
		]);
	}

	@step("Received tip amount is displayed in transaction details")
	public async receivedTipAmountIsDisplayed(amount: number): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.amountValue,
				expectedValue: this.isTipAmountSent(amount, false),
			},
		]);
	}

	@step(
		"Contact support and Got it buttons are visible in transaction details",
	)
	public async contactSupportAndGotItButtonsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.contactSupportButton,
			this.gamdomPage.map.gotItButton,
		]);
	}

	private isTipAmountSent(amount: number, isSent: boolean): string {
		const formattedAmount = amount.toFixed(2);
		return isSent ? `-${formattedAmount}` : `${formattedAmount}`;
	}
}
