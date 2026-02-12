import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class TransactionsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get depositsTabs(): Locator {
		return this.page.getByTestId("transactions-types-tabs-deposit");
	}

	public get withdrawsTab(): Locator {
		return this.page.getByTestId("transactions-types-tabs-withdrawal");
	}

	public get tipsTab(): Locator {
		return this.page.getByTestId("transactions-types-tabs-tip");
	}

	public get rewardsTab(): Locator {
		return this.page.getByTestId("transactions-types-tabs-rewards");
	}

	public get transactionDetailsButton(): Locator {
		return this.page
			.locator(
				'[data-testid*="tips-transactions-cell-"][data-testid$="_action"]',
			)
			.locator("button");
	}

	public get transactionStatus(): Locator {
		return this.page.locator("p[status]");
	}

	public get userProfileWrapper(): Locator {
		return this.page.locator("div[class*='ProfileMainContainer-sc']");
	}

	public get transactionsContainer(): Locator {
		return this.userProfileWrapper.getByTestId(
			"transactions-types-tabs-container",
		);
	}

	public get tipAmount(): Locator {
		return this.transactionsContainer.getByTestId("fiat-value");
	}

	public get successStatus(): Locator {
		return this.transactionsContainer.locator(
			'p[data-testid^="transaction-status-"]',
		);
	}

	public get arrowButtonTransactionDetails(): Locator {
		return this.page.locator(
			'i[class*="ArrowButton-styled__ArrowButtonIcon"]',
		);
	}

	public get receivedByValue(): Locator {
		return this.page.getByLabel("Received By");
	}

	public get sentByValue(): Locator {
		return this.page.getByLabel("Sent By");
	}

	public get amountValue(): Locator {
		return this.page.getByTestId("tip-Tip-amount-input");
	}

	public get contactSupportButton(): Locator {
		return this.page
			.getByTestId("tip-Tip-block-chain-transaction")
			.filter({ hasText: "Contact Support" });
	}

	public get gotItButton(): Locator {
		return this.page
			.getByTestId("tip-Tip-dialog-close")
			.filter({ hasText: "Got it" });
	}
}
