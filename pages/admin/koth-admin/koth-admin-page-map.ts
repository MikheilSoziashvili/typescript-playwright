import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KothAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get kothAdminPanelTitle(): Locator {
		return this.page.locator('h1:text-is("Welcome to KOTH admin panel")');
	}
}
