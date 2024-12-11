import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class FeaturesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get featuresSettingsTitle(): Locator {
		return this.page.locator('h4:text-is("Features Settings")');
	}
}
