import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CryptoAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sendQueuedWithdrawalsButton(): Locator {
		return this.page.locator('button:text-is("Send queued withdrawals")');
	}

	public get refreshButton(): Locator {
		return this.page.locator("span", { hasText: "Refresh" });
	}

	public minDepositButton(nodeTitle: string): Locator {
		return this.page
			.locator("tr", { hasText: nodeTitle })
			.locator("td img")
			.nth(0);
	}

	public minWithdrawButton(nodeTitle: string): Locator {
		return this.page
			.locator("tr", { hasText: nodeTitle })
			.locator("td img")
			.nth(2);
	}
}
