import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class DynamicDomainsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get currentDomainsHeader(): Locator {
		return this.page.locator('h3:text-is("Current Domains")');
	}
}
