import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CryptoAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sendQueuedWithdrawalsButton(): Locator {
		return this.page.getByTestId("sendQueuedWithdrawalsButton");
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

	public get cryptoTableContainer(): Locator {
		return this.page.getByTestId("denseTableContainer");
	}

	public cryptoRow(cryptoName: string): Locator {
		return this.cryptoTableContainer.locator("tbody tr", {
			has: this.page.getByRole("rowheader", { name: cryptoName }),
		});
	}

	public depositToggle(cryptoName: string): Locator {
		return this.cryptoRow(cryptoName)
			.locator("td")
			.nth(0)
			.locator('input[type="checkbox"]');
	}

	public withdrawToggle(cryptoName: string): Locator {
		return this.cryptoRow(cryptoName)
			.locator("td")
			.nth(1)
			.locator('input[type="checkbox"]');
	}
}
