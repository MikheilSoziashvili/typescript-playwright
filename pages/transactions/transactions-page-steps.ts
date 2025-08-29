import { BasePageStep } from "@pages/base/base-page-step";
import { TransactionsPage } from "./transactions-page";
import { step } from "decorators/step";
import { TransactionState } from "@enums/transaction-states";
import { TransactionType } from "@enums/transaction-types";

export class TransactionsSteps extends BasePageStep<TransactionsPage> {
	public constructor(page: TransactionsPage) {
		super(page);
	}

	@step("Verify deposit transaction status is")
	public async verifyDepositTransactionStatusIs(
		status: TransactionState,
	): Promise<void> {
		await this.verifyTransactionStatus(TransactionType.DEPOSIT, status);
	}

	@step("Verify withdraw transaction status is")
	public async verifyWithdrawTransactionStatusIs(
		status: TransactionState,
	): Promise<void> {
		await this.verifyTransactionStatus(TransactionType.WITHDRAWAL, status);
	}

	@step("Verify transaction status")
	private async verifyTransactionStatus(
		type: TransactionType,
		status: TransactionState,
	): Promise<void> {
		await this.gamdomPage.navigate();

		switch (type) {
			case TransactionType.DEPOSIT:
				await this.gamdomPage.openDepositsTab();
				break;
			case TransactionType.WITHDRAWAL:
				await this.gamdomPage.openWithdrawsTab();
				break;
		}

		await this.gamdomPage.assertThat().assertTransactionStatusIs(status);
	}

	@step("Verify tip sent transaction details")
	public async verifyTipSentTransactionDetails(
		tipValue: number,
		userName: string,
	): Promise<void> {
		await this.gamdomPage.assertThat().tipSentValueIsCaptured(tipValue);
		await this.gamdomPage.assertThat().tipSentAndSuccessStatusAreVisible();

		await this.gamdomPage.map.arrowButtonTransactionDetails.click();
		await this.gamdomPage.assertThat().receivedTipUserIsDisplayed(userName);
		await this.gamdomPage.assertThat().sentTipAmountIsDisplayed(tipValue);
		await this.gamdomPage
			.assertThat()
			.contactSupportAndGotItButtonsAreVisible();
	}

	@step("Verify tip received transaction details")
	public async verifyTipReceivedTransactionDetails(
		tipValue: number,
		userName: string,
	): Promise<void> {
		await this.gamdomPage.assertThat().tipReceivedValueIsCaptured(tipValue);
		await this.gamdomPage
			.assertThat()
			.tipReceivedAndSuccessStatusAreVisible();

		await this.gamdomPage.map.arrowButtonTransactionDetails.click();
		await this.gamdomPage.assertThat().sentTipUserIsDisplayed(userName);
		await this.gamdomPage
			.assertThat()
			.receivedTipAmountIsDisplayed(tipValue);
		await this.gamdomPage
			.assertThat()
			.contactSupportAndGotItButtonsAreVisible();
	}
}
