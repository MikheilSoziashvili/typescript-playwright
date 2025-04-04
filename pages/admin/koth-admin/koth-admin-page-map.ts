import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KothAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get kothAdminPageContent(): Locator {
		return this.page.getByTestId("adminKothPageContent");
	}

	public get kothAdminPanelTitle(): Locator {
		return this.kothAdminPageContent.getByTestId("headerTitle");
	}

	public get kothAdminPanelSubtitle(): Locator {
		return this.kothAdminPageContent.getByTestId("headerSubtitle");
	}
}
