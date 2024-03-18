import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class ProfilePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get logOutButton(): Locator {
		return this.page.locator("button:has(p:text-is('Log out'))");
	}
}
