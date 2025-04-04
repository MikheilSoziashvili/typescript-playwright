import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class MarketingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get marketingAdminPageContent(): Locator {
		return this.page.getByTestId("adminMarketingPanelPageContent");
	}

	public get marketingPanelTitle(): Locator {
		return this.marketingAdminPageContent.getByTestId("pageHeaderTitle");
	}
}
