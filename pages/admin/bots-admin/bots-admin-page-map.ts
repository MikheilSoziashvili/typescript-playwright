import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class BotsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get tradebotsHeader(): Locator {
		return this.page.locator('h3.trans_head:has-text("Tradebots")');
	}
}
