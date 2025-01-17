import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class HelpPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get helpPageContainer(): Locator {
		return this.page.locator("[id='site_content']");
	}

	public get helpPageTitle(): Locator {
		return this.helpPageContainer.locator("h1");
	}

	public get helpPageContent(): Locator {
		return this.helpPageContainer.locator(
			"div[class*='MuiBox-root'] div[class*='ContainerAnimate-sc-']",
		);
	}

	public tabNameByPlaceholder(placeholderText: string): Locator {
		return this.helpPageContainer.locator(
			`//div[@role="tablist"]//a[@role='tab' and text()='${placeholderText}']`,
		);
	}
}
