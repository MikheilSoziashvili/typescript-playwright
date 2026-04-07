import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class Error404PageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get error404Page(): Locator {
		return this.page.getByTestId("error-404-main-container");
	}

	public get error404Title(): Locator {
		return this.error404Page.locator("img");
	}

	public get error404Message(): Locator {
		return this.error404Page.getByTestId("error-404-message");
	}

	public get error404ReturnHomeButton(): Locator {
		return this.error404Page.getByTestId("404-home-lnk");
	}
}
