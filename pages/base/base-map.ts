import { VisibilityState } from "@enums/playwright/visibility-states";
import { Locator, Page, expect } from "@playwright/test";

export class BaseMap {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	protected async waitUntilContainsText(
		locator: Locator,
		text: string | RegExp,
		timeout?: number,
	): Promise<Locator> {
		await expect(locator).toContainText(text, { timeout: timeout });
		return locator;
	}

	protected async waitUntilVisible(locator: Locator): Promise<Locator> {
		await expect(locator).toBeVisible();
		return locator;
	}

	async waitFor(parameters: {
		locator: Locator;
		state: VisibilityState;
		timeout?: number;
	}): Promise<void> {
		const { locator, state, timeout } = parameters;
		await locator.waitFor({
			state,
			timeout,
		});
	}

	async waitForVisibility(parameters: {
		locator: Locator;
		timeout?: number;
	}): Promise<void> {
		await this.waitFor({
			...parameters,
			state: VisibilityState.VISIBLE,
		});
	}

	async waitForAttributeToHaveValue(
		locator: Locator,
		attribute: string,
		expectedValue: string,
		timeout?: number,
	): Promise<void> {
		await expect(locator).toHaveAttribute(attribute, expectedValue, {
			timeout,
		});
	}
}
