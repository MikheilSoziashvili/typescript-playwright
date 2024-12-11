import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class EventsManagingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get logoHeader(): Locator {
		return this.page.locator('h5:text-is("logo")');
	}
}
