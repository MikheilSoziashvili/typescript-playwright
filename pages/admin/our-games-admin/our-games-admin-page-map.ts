import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class OurGamesAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get saveAndUploadConfigButton(): Locator {
		return this.page.getByTestId("saveAndUploadConfigButton");
	}
}
