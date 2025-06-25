import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { TransactionsAsserter } from "./transactions-page-asserter";
import { TransactionsMap } from "./transactions-page-map";
import { TransactionsSteps } from "./transactions-page-steps";
import { TRANSACTIONS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { waitUntil } from "@core/utils/utils";
import { step } from "decorators/step";
import { TransactionState } from "@enums/transaction-states";

export class TransactionsPage extends BasePage<TransactionsMap> {
	public constructor(page: Page) {
		super(page, new TransactionsMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [TRANSACTIONS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): TransactionsAsserter {
		return new TransactionsAsserter(this);
	}

	public steps(): TransactionsSteps {
		return new TransactionsSteps(this);
	}

	@step("Open deposits tab")
	public async openDepositsTab(): Promise<void> {
		await this.map.depositsTabs.click();
	}

	@step("Open withdraws tab")
	public async openWithdrawsTab(): Promise<void> {
		await this.map.withdrawsTab.click();
	}

	@step("Click transaction details button")
	public async clickTransactionDetailsButton(): Promise<void> {
		await this.map.transactionDetailsButton.click();
	}

	@step("Get transaction status")
	public async getTransactionStatus(): Promise<string> {
		const status = await this.map.transactionStatus.textContent();
		if (status === null) {
			throw new Error("Transaction status could not be retrieved.");
		}
		return status;
	}

	@step("Wait for transaction status")
	public async waitForTransactionStatus(
		expectedStatus: TransactionState,
	): Promise<TransactionState> {
		let finalStatus = TransactionState.PENDING;

		await waitUntil(
			async () => {
				finalStatus =
					(await this.getTransactionStatus()) as TransactionState;
				return finalStatus === expectedStatus;
			},
			{
				errorMessage: `Transaction did not reach '${expectedStatus}' status in time`,
				intervalSeconds: 5,
				timeoutSeconds: 80,
			},
		);

		return finalStatus;
	}
}
