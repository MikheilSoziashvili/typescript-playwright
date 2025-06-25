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
}
