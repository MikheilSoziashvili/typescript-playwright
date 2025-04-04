import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class FeaturesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get featuresAdminPageContent(): Locator {
		return this.page.getByTestId("adminFeaturesPageContent");
	}

	public get featuresSettingsTableContainer(): Locator {
		return this.featuresAdminPageContent.getByTestId(
			"adminFeaturesPageTableContainer",
		);
	}

	public get featuresSettingsTitle(): Locator {
		return this.featuresSettingsTableContainer
			.getByTestId("tableHeaderContainer")
			.getByTestId("tableHeaderTitle");
	}
}
