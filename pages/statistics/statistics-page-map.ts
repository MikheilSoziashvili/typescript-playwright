import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class StatisticsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get last24HoursStatsTitle(): Locator {
		return this.page.locator("h5", { hasText: "Last 24 Hours Stats" });
	}

	public get last24HoursStatsTable(): Locator {
		return this.page.locator("table[class*=sc-]");
	}

	public last24HoursGameStatsRowByPlaceholder(gameName: string): Locator {
		return this.last24HoursStatsTable
			.locator(`h6`, {
				hasText: gameName,
			})
			.locator("//ancestor::tr");
	}

	public last24HoursGameLargestProfitByPlaceholder(
		gameName: string,
	): Locator {
		return this.last24HoursGameStatsRowByPlaceholder(gameName).locator(
			`//td[3]//span[@class='currency-amount']`,
		);
	}
}
