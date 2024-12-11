import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class EvRewardsSystemAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get bulkRewardsUploadButton(): Locator {
		return this.page.locator('span:text-is("Bulk Rewards Upload")');
	}
}
