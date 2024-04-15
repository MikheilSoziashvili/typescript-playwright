import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class BannedUserPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get restrictedContainer(): Locator {
		return this.page.locator("div#restricted-container");
	}

	public get redContainer(): Locator {
		return this.restrictedContainer.locator("div.container-red");
	}

	public get restrictionTitle(): Locator {
		return this.redContainer.locator("h1");
	}

	public get bannedReason(): Locator {
		return this.redContainer.locator("h4");
	}
}
