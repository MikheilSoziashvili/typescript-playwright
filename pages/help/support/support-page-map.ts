import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class SupportPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get supportHeading(): Locator {
		return this.page.getByRole("heading", { name: "Support", exact: true });
	}
}
