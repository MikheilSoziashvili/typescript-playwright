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
			hasText: "Withdraws",
		});
	}

	public get transactionDetailsButton(): Locator {
		return this.page.locator('button[class*="ArrowButton-styled"]');
	}

	public get transactionStatus(): Locator {
		return this.page.locator("p[status]");
	}
}
