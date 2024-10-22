import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class FooterMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get footerContainer(): Locator {
		return this.page.locator("//footer");
	}

	public footerLinkByPlaceholder(placeholderText: string): Locator {
		return this.footerContainer.locator(`//a[text()="${placeholderText}"]`);
	}
}
