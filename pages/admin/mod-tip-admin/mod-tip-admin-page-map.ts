import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class ModTipAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modTipAdminPageContent(): Locator {
		return this.page.getByTestId("adminModTipPageContent");
	}

	public get sendModTipNowContainer(): Locator {
		return this.modTipAdminPageContent.getByTestId(
			"sendModTipNowContainer",
		);
	}

	public get sendModTipNowTitle(): Locator {
		return this.sendModTipNowContainer.getByTestId("containerTitle");
	}
}
