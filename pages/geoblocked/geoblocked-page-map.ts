import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class GeoblockedPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get errorContainer(): Locator {
		return this.page.locator(
			"div[class*=GeoblockDiv] div[class*=GeoBlocked-styled__RedContainer]",
		);
	}

	public get errorTitleLocator(): Locator {
		return this.errorContainer.locator("h1[class*=Title]");
	}

	public get errorSubTitleLocator(): Locator {
		return this.errorContainer.locator("h4[class*=SubTitle]");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.page.locator('[class*="SociaButtonsContainer"]');
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`img[alt='${socialMedia}']`,
		);
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`//img[@alt="${socialMedia}"]//parent::a[contains(@class,"SocialButtons")]`,
		);
	}
}
