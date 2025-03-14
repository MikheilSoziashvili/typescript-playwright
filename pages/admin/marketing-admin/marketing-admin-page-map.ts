import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class MarketingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get marketingPanelTitle(): Locator {
		return this.page.locator('h4.title:text-is("Marketing panel")');
	}
}
