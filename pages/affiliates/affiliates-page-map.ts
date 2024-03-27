import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class AffiliatesPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliatesBox(): Locator {
		return this.page.getByTestId("affilitesContainerBox");
	}

	public get affiliatesEnterCodeContainer(): Locator {
		return this.page.getByTestId("afiliatesEnterCodeContainer");
	}

	public get newAffilitatesCodeField(): Locator {
		return this.affiliatesEnterCodeContainer.locator("input");
	}

	public get saveAffiliatesCodeButton(): Locator {
		return this.affiliatesEnterCodeContainer.getByTestId(
			"afiliatesSaveCodeButton",
		);
	}

	public get createdAffiliatesCodeField(): Locator {
		return this.affiliatesBox
			.getByTestId("affiliatesCodeInputContainer")
			.locator("input");
	}

	public get copyCodeToClipboardField(): Locator {
		return this.affiliatesBox
			.getByTestId("affiliatesCopyCodeContainer")
			.locator("input");
	}
}
