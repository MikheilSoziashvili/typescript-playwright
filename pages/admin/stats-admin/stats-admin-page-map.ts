import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class StatsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get statsAdminStatsTabsContainer(): Locator {
		return this.page.getByTestId("admin-stats-tabs");
	}

	public get statsAdminStatsKothCurrentEventsContainer(): Locator {
		return this.page.getByTestId("admin-stats-koth-current-events");
	}

	public get currentKingOfTheHillEventsHeader(): Locator {
		return this.statsAdminStatsKothCurrentEventsContainer.getByTestId(
			"admin-stats-koth-current-events-title",
		);
	}
}
