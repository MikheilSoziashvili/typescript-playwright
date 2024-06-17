import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class SteamBlockedPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get continueAnywayButton(): Locator {
		return this.page.locator('a:text-is("continue anyway")');
	}

	public get signInButton(): Locator {
		return this.page.locator('input[value="Sign In"]');
	}
}
