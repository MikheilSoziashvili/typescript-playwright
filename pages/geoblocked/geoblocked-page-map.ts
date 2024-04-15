import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class GeoblockedPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get errorContainer(): Locator {
		return this.page.locator(
			"div[class*=GeoblockDiv] div[class*=GeoBlocked-styled__RedContainer]",
		);
	}

	public get errorTitleLocator(): Locator {
		return this.errorContainer.locator("h1[class*=Title]");
	}

	public get errorSubTitleLocator(): Locator {
		return this.errorContainer.locator("h4[class*=SubTitle]");
	}
}
