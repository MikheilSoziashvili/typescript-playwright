import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class EsportsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get esportsPageTitle(): Locator {
		return this.page.locator('div h1:text-is("E-Sports Betting")');
	}
}
