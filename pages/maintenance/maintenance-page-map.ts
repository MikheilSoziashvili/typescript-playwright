import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class MaintenancePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get socialMediaFooterContainer(): Locator {
		return this.page.locator('[class="socials"]');
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`[class="secondary-button"] a[href*='${socialMedia}']`,
		);
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`//a[contains(@href,'${socialMedia}')]//parent::div[@class="secondary-button"]`,
		);
	}
}
