import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class BaseAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getAdminPageLocator(pageName: string): Locator {
		return this.page.locator(`ul.admin_nav a[href='/admin/${pageName}']`);
	}
}
