import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class RainAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get makeItRainTitle(): Locator {
		return this.page.locator('h4.title:text-is("Make it rain")');
	}
}
