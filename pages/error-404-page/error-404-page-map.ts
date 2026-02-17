import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { Error404PageContent } from "@constants/error-404-page-content";

export class Error404PageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get error404Page(): Locator {
		return this.page.getByTestId("page-container-animate");
	}

	public get error404Title(): Locator {
		return this.error404Page.locator(
			`h1:has-text("${Error404PageContent.TITLE}")`,
		);
	}

	public get error404Message(): Locator {
		return this.error404Page.locator(
			`h6:has-text("${Error404PageContent.MESSAGE}")`,
		);
	}

	public get error404ReturnHomeButton(): Locator {
		return this.error404Page.locator(
			`button:has-text("${Error404PageContent.RETURN_HOME_BUTTON}")`,
		);
	}
}
