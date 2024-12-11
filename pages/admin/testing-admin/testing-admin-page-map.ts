import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class TestingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get mockDateButton(): Locator {
		return this.page.locator('button:text-is("MOCK DATE")');
	}
}
