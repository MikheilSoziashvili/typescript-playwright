import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class GeoblockedPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get geoblockedPageContent(): Locator {
		return this.page.getByTestId("error-page-banned-country");
	}

	public get errorContainer(): Locator {
		return this.geoblockedPageContent.getByTestId(
			"error-page-banned-country-content",
		);
	}

	public get errorTitleLocator(): Locator {
		return this.errorContainer.getByTestId(
			"error-page-banned-country-description",
		);
	}

	public get errorCountryLocator(): Locator {
		return this.errorContainer.getByTestId(
			"error-page-banned-country-country-container",
		);
	}

	public get socialMediaFooterContainer(): Locator {
		return this.geoblockedPageContent.getByTestId(
			"error-page-banned-country-social-buttons",
		);
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.getByTestId(
			`${socialMedia}-img`,
		);
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.getByTestId(
			`${socialMedia}-link`,
		);
	}
}
