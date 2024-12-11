import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CommunityConnectAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get changeFsCurrencyTitle(): Locator {
		return this.page.locator('h4.title:text-is("CHANGE FS CURRENCY")');
	}
}
