import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class TransactionsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get depositsTabs(): Locator {
		return this.page.locator("button", {
			hasText: "Deposits",
		});
	}

	public get withdrawsTab(): Locator {
		return this.page.locator("button", {
			hasText: "Withdrawals",
		});
	}

	public get tipsTab(): Locator {
		return this.page.locator("button", {
			hasText: "Tips",
		});
	}

	public get transactionDetailsButton(): Locator {
		return this.page.locator('button[class*="ArrowButton-styled"]');
	}

	public get transactionStatus(): Locator {
		return this.page.locator("p[status]");
	}

	public get userProfileWrapper(): Locator {
		return this.page.locator("div[class*='UserProfileWrapper-styled']");
	}

	public get tipAmount(): Locator {
		return this.userProfileWrapper.locator(".currency-amount");
	}

	public get tipSentText(): Locator {
		return this.page.locator("p", { hasText: "Tip sent" });
	}

	public get tipReceivedText(): Locator {
		return this.page.locator("p", { hasText: "Tip received" });
	}

	public get successStatus(): Locator {
		return this.page.locator('p[status="success"]');
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
		return this.page.getByLabel("Amount");
	}

	public get contactSupportButton(): Locator {
		return this.page.locator("button", { hasText: "Contact Support" });
	}

	public get gotItButton(): Locator {
		return this.page.locator("button", { hasText: "Got it" });
	}
}
