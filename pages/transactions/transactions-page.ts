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
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { TransactionType } from "@enums/transaction-types";

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
	public async getTransactionStatus(type: TransactionType): Promise<string> {
		await waitUntil(
			async () => {
				const count = await this.map.transactionStatus.count();
				if (count !== 1) {
					await this.page.reload();

					switch (type) {
						case TransactionType.DEPOSIT:
							await this.openDepositsTab();
							break;
						case TransactionType.WITHDRAWAL:
							await this.openWithdrawsTab();
							break;
					}
				}
				return count === 1;
			},
			{
				errorMessage: "Multiple transactions are still visible",
				intervalSeconds: TimeoutSeconds.TWO,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);

		const status = await this.map.transactionStatus.textContent();
		if (status === null) {
			throw new Error("Transaction status could not be retrieved.");
		}
		return status;
	}

	@step("Wait for transaction status")
	public async waitForTransactionStatus(
		expectedStatus: TransactionState,
		type: TransactionType,
	): Promise<TransactionState> {
		let finalStatus = TransactionState.PENDING;

		await waitUntil(
			async () => {
				finalStatus = (await this.getTransactionStatus(
					type,
				)) as TransactionState;
				return finalStatus === expectedStatus;
			},
			{
				errorMessage: `Transaction did not reach '${expectedStatus}' status in time`,
				intervalSeconds: TimeoutSeconds.FIVE,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);

		return finalStatus;
	}

	@step("Open tips tab")
	public async openTipsTab(): Promise<void> {
		await this.map.tipsTab.click();
	}

	@step("Expand tip transaction details")
	public async expandTipTransactionDetails(): Promise<void> {
		await this.map.arrowButtonTransactionDetails.click();
	}
}
