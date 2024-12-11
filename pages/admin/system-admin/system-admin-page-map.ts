import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SystemAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get systemActionsHeader(): Locator {
		return this.page.locator('h3:text-is("System Actions")');
	}
}
