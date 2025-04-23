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
		return this.footerContainer.locator("a", {
			hasText: placeholderText,
		});
	}

	public socialMediaFooterLinkByPlaceholder(
		socialMediaText: string,
	): Locator {
		return this.footerContainer.locator(
			`//img[@alt='${socialMediaText}']//parent::a[contains(@class,'IconButton')]`,
		);
	}

	public socialMediaFooterIconByPlaceholder(
		socialMediaText: string,
	): Locator {
		return this.footerContainer.locator(
			`//a[contains(@class,'IconButton')]//img[@alt='${socialMediaText}']`,
		);
	}

	public get socialMediaFooterIconsContainer(): Locator {
		return this.footerContainer.locator(
			`//a[contains(@class,'IconButton')]//ancestor::div[contains(@class,"MuiBox-root")]`,
		);
	}

	public get liveSupportButton(): Locator {
		return this.page.getByTestId("footerLinkLiveSupport");
	}
}
