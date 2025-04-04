import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PriceWatchAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get priceWatchAdminNavigationContainer(): Locator {
		return this.page.getByTestId("admin-price-watch-nav");
	}

	public get updatePricesFromSourcesLink(): Locator {
		return this.priceWatchAdminNavigationContainer.getByTestId(
			"admin-price-watch-update-prices-link",
		);
	}
}
