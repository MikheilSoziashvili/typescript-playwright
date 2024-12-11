import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class StatsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get currentKingOfTheHillEventsHeader(): Locator {
		return this.page.locator(
			'h5:text-is("Current King of the Hill Events")',
		);
	}
}
