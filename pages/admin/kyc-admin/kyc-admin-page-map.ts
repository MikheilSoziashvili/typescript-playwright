import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KycAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get searchByUserIdInput(): Locator {
		return this.page.getByTestId("searchByUserIdInput");
	}
}
