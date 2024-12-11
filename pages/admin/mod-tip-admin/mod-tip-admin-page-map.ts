import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class ModTipAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get sendModTipNowTitle(): Locator {
		return this.page.locator('h4.title:text-is("Send Mod Tip Now")');
	}
}
