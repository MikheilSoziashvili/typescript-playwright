import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class FaqPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliateCodeRegisterContainer(): Locator {
		return this.page.locator(
			"div.MuiAccordion-root:has(div.MuiAccordionSummary-content h5:text-is('What affiliate code am I registered under?'))",
		);
	}

	public get expandAffiliateCodeRegisterButtonLocator(): Locator {
		return this.affiliateCodeRegisterContainer.locator(
			"div.MuiAccordionSummary-root[role=button]",
		);
	}

	public get affiliateUnderCodeLinkButtonLocator(): Locator {
		return this.affiliateCodeRegisterContainer.locator("a[href='#']");
	}
}
