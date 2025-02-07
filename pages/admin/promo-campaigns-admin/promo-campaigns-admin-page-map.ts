import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PromoCampaignsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promoCampaignsContainer(): Locator {
		return this.page.locator(`div[class="gameEdit"]`);
	}

	public get newPromoCodeButton(): Locator {
		return this.promoCampaignsContainer.locator(`button`, {
			has: this.page.locator(`span`, { hasText: "New Promo Code" }),
		});
	}
}
