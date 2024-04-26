import { Locator, Page, expect } from "@playwright/test";

export class BaseMap {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	protected async waitUntilContainsText(
		locator: Locator,
		text: string | RegExp,
	): Promise<Locator> {
		await expect.soft(locator).toContainText(text);
		return locator;
	}

	protected async waitUntilVisible(locator: Locator): Promise<Locator> {
		await expect.soft(locator).toBeVisible();
		return locator;
	}
}
