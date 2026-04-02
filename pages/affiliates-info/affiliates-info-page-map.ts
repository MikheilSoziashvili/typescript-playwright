import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class AffiliatesInfoPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get heroTitle(): Locator {
		return this.page.getByTestId("hero-banner-title");
	}

	public get heroBannerWrapper(): Locator {
		return this.page
			.locator("div", { has: this.heroTitle })
			.filter({ hasNot: this.page.locator("img[alt='hero banner']") });
	}

	public get joinNowButton(): Locator {
		return this.heroBannerWrapper.getByTestId("external-affiliates-v4-cta-button");
	}
}
