import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PaymentsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get settingsButton(): Locator {
		return this.page.locator('button:text-is("Settings")');
	}
}
