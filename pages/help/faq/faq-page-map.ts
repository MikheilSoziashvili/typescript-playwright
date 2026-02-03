import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class FaqPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get faqAccordionContainer(): Locator {
		return this.page.getByTestId("accordion-header-txt");
	}

	public get expandAffiliateCodeToggle(): Locator {
		return this.faqAccordionContainer
			.filter({ hasText: "What affiliate code am I registered under?" })
			.locator("xpath=..")
			.getByTestId("faq-affiliate-code-toggle");
	}

	public get affiliateUnderCodeLinkButtonLocator(): Locator {
		return this.page
			.getByTestId("faq-affiliate-code-accordion-content")
			.getByRole("link");
	}
}
