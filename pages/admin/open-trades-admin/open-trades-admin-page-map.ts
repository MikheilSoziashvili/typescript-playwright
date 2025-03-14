import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class OpenTradesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get openTradesAdminPageContent(): Locator {
		return this.page.getByTestId("tradewatchContainer");
	}

	public get unsentTradeHistoryHeader(): Locator {
		return this.openTradesAdminPageContent.getByTestId("tradeHistoryTitle");
	}
}
