import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class OpenTradesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get unsentTradeHistoryHeader(): Locator {
		return this.page.locator('h3:text-is("unsent trade history")');
	}
}
