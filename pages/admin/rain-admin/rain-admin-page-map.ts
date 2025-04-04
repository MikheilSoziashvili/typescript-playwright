import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class RainAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get rainAdminPageContent(): Locator {
		return this.page.getByTestId("admin-reduce-system-page");
	}

	public get makeItRainContainer(): Locator {
		return this.rainAdminPageContent.getByTestId(
			"admin-reduce-system-make-it-rain",
		);
	}

	public get makeItRainTitle(): Locator {
		return this.makeItRainContainer.getByTestId(
			"admin-reduce-system-make-it-rain-title",
		);
	}
}
