import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CasinoGamesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get downloadGamesCsvButton(): Locator {
		return this.page.locator('button:text-is("Download games CSV")');
	}
}
