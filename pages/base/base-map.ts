import { Locator, Page, expect } from "@playwright/test";

export class BaseMap {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	protected async waitUntilVisible(locator: Locator): Promise<Locator> {
		await expect(locator).toBeVisible();
		return locator;
	}
}
