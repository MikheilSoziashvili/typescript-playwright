import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KycAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get searchByUserIdInput(): Locator {
		return this.page.locator(
			'div.inp-wrap span.inp-title:text-is("Search by user id") ~ input',
		);
	}
}
