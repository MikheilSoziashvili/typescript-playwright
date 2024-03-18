import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class RewardsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	//TODO: Add locator for special offer container and make sure child locators are descending from it
	
	public get activateNowButton(): Locator {
		return this.page.getByText("Activate Now");
	}

	public get inProgressButton(): Locator {
		return this.page.getByText("In Progress");
	}

	public get claimedBadge(): Locator {
		return this.page.locator("div:text-is('Claimed')");
	}
}
