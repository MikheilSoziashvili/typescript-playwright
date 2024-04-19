import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class RewardsExplorePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get currentRoyaltyContainer(): Locator {
		return this.page.locator("div.sc-cxtRbA").filter({
			has: this.page.locator('div.sc-cHWeeV:text-is("CURRENT")'),
		});
	}

	public get currentRoyaltyContainerExpandButton(): Locator {
		return this.currentRoyaltyContainer.locator(
			'div[aria-label="collapse button"]',
		);
	}

	public get currentRoyaltyContainerInstantRakebackLocator(): Locator {
		return this.currentRoyaltyContainer
			.locator("ul")
			.last()
			.locator("li")
			.first()
			.locator("span");
	}
}
