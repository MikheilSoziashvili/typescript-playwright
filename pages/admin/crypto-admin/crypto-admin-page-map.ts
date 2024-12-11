import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CryptoAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sendQueuedWithdrawalsButton(): Locator {
		return this.page.locator('button:text-is("Send queued withdrawals")');
	}
}
