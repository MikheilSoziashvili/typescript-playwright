import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CryptoAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get cryptoAdminPageContent(): Locator {
		return this.page.getByTestId("adminCryptoPageContent");
	}

	public get sendQueuedWithdrawalsButton(): Locator {
		return this.cryptoAdminPageContent.getByTestId(
			"sendQueuedWithdrawalsButton",
		);
	}

	public get refreshButton(): Locator {
		return this.page
			.getByTestId("currentCryptoDataContainer")
			.locator('span[class*="MuiTypography-body"]');
	}

	public minDepositButton(nodeTitle: string, currency?: string): Locator {
		let row = this.page.locator("tr").filter({ hasText: nodeTitle });
		if (currency) {
			row = row.filter({ hasText: currency });
		}
		return row.locator("td img").first();
	}

	public minWithdrawButton(nodeTitle: string, currency?: string): Locator {
		let row = this.page.locator("tr").filter({ hasText: nodeTitle });
		if (currency) row = row.filter({ hasText: currency });
		return row.locator("td img").first();
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
