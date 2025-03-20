import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TransactionDetailsModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get depositAmountInBTC(): Locator {
		return this.page
			.locator("label", { hasText: "Deposit Amount in BTC" })
			.locator("~ div input");
	}
}
