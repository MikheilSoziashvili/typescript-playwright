import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PriceWatchAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get updatePricesFromSourcesLink(): Locator {
		return this.page.locator(
			'a.admin_nav_link[href="/admin/PriceWatchAdmin/update-prices"]:text-is("Update prices from sources")',
		);
	}
}
