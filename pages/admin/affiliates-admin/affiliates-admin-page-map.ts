import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class AffiliatesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliatesAdminSearchContainer(): Locator {
		return this.page.getByTestId("adminAffiliatesSearchPageContent");
	}

	public get affiliatesAdminSearchFieldContainer(): Locator {
		return this.affiliatesAdminSearchContainer.getByTestId(
			"searchFieldContainer",
		);
	}

	public get searchCodeLabel(): Locator {
		return this.affiliatesAdminSearchFieldContainer.locator("label");
	}
}
