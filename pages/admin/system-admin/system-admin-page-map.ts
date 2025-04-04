import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SystemAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get systemAdminPageContent(): Locator {
		return this.page.getByTestId("system-actions-page");
	}

	public get systemActionsHeader(): Locator {
		return this.systemAdminPageContent.getByTestId("system-actions-title");
	}
}
