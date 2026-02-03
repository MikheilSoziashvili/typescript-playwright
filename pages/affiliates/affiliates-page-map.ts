import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class AffiliatesPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliatesBox(): Locator {
		return this.page.getByTestId("affilitesContainerBox");
	}

	public get affiliatesEnterCodeContainer(): Locator {
		return this.page.getByTestId("create-affiliate-input-container");
	}

	public get newAffilitatesCodeField(): Locator {
		return this.affiliatesEnterCodeContainer.getByTestId(
			"create-affiliate-input-input",
		);
	}

	public get createAffiliatesCodeButton(): Locator {
		return this.page.getByTestId("create-affiliate-button");
	}

	public get createdAffiliatesCodeContainer(): Locator {
		return this.page.getByTestId("your-affiliate-code-container");
	}

	public get createdAffiliatesCodeField(): Locator {
		return this.createdAffiliatesCodeContainer.getByTestId(
			"your-affiliate-code-input",
		);
	}

	public get copyCodeToClipboardField(): Locator {
		return this.page.getByTestId("your-affiliate-code-copy-button");
	}
}
