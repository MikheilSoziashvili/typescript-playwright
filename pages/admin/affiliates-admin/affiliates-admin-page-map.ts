import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class AffiliatesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get searchCodeLabel(): Locator {
		return this.page.locator('label:text-is("Search code")');
	}
}
