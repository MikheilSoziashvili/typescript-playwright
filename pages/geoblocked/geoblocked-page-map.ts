import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class GeoblockedPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get geoblockedPageContent(): Locator {
		return this.page.getByTestId("geoblockPageContent");
	}

	public get errorContainer(): Locator {
		return this.geoblockedPageContent.getByTestId("geoblockRedContainer");
	}

	public get errorTitleLocator(): Locator {
		return this.errorContainer.getByTestId("geoblockTitle");
	}

	public get errorSubTitleLocator(): Locator {
		return this.errorContainer.getByTestId("geoblockSubTitle");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.geoblockedPageContent.getByTestId(
			"geoblockSocialButtonsContainer",
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
