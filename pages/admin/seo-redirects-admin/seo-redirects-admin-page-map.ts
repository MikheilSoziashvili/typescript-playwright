import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SeoRedirectsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get newRedirectButton(): Locator {
		return this.page.locator("button", {
			hasText: "New Redirect",
		});
	}

	public get rowByFromPath(): (fromPath: string) => Locator {
		return (fromPath: string) =>
			this.page.locator("tbody tr", {
				has: this.page.locator("td:first-child", { hasText: fromPath }),
			});
	}

	public get editButtonInRow(): (fromPath: string) => Locator {
		return (fromPath: string) =>
			this.rowByFromPath(fromPath).locator('[aria-label="Edit"]');
	}

	public get deleteButtonInRow(): (fromPath: string) => Locator {
		return (fromPath: string) =>
			this.rowByFromPath(fromPath).locator('[aria-label="Delete"]');
	}

	public get historyTab(): Locator {
		return this.page.locator('a[href="/admin/SEORedirects/history"]');
	}

	public get historyChangeRow(): (text: string) => Locator {
		return (text: string) =>
			this.page.locator("tbody td", { hasText: text });
	}
}
