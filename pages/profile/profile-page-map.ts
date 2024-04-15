import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class ProfilePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get leftMenu(): Locator {
		return this.page.getByTestId("profileLeftMenu");
	}

	public get logOutButton(): Locator {
		return this.leftMenu.locator("button:has(p:text-is('Log out'))");
	}

	public get hideStatisticsToggle(): Locator {
		return this.page.getByTestId("profileHideStatistics").locator("input");
	}
}
