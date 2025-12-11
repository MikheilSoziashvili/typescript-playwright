import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class FaqPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliateCodeRegisterContainer(): Locator {
		return this.page.getByTestId("accordion-affiliate");
	}

	public get expandAffiliateCodeRegisterButtonLocator(): Locator {
		return this.affiliateCodeRegisterContainer
			.getByTestId("accordion-summary-affiliate")
			.filter({ hasText: "What affiliate code am I registered under?" });
	}

	public get affiliateUnderCodeLinkButtonLocator(): Locator {
		return this.page
			.getByTestId("text-block-wrapper-affiliate-code-2")
			.locator("[class*='FAQ-styled__LinkText']");
	}
}
