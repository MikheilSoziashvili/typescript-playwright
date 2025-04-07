import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class MaintenancePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get maintenancePageContent(): Locator {
		return this.page.getByTestId("restricted-container");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.page.locator('[class="socials"]');
		// return this.maintenancePageContent.getByTestId("socials");
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`[class="secondary-button"] a[href*='${socialMedia}']`,
			// return this.socialMediaFooterContainer.getByTestId(
			// 	`${socialMedia}-link`,
		);
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`//a[contains(@href,'${socialMedia}')]//parent::div[@class="secondary-button"]`,
			// return this.socialMediaFooterContainer.getByTestId(
			// 	`${socialMedia}-button`,
		);
	}
}
