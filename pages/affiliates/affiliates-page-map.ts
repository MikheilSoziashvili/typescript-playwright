import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class AffiliatesPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get affiliatesContainer(): Locator {
		return this.page.locator(
			"div:has(p:text-is('Create your code below to start earning FREE rewards'))",
		);
	}

	public get newAffilitatesCodeField(): Locator {
		return this.affiliatesContainer.getByPlaceholder(
			"Enter your desired code..",
		);
	}

	public get saveAffiliatesCodeButton(): Locator {
		return this.affiliatesContainer.locator("button:has-text('Save')");
	}

	public get createdAffiliatesCodeField(): Locator {
		return this.affiliatesContainer.locator("input[name=affiliates]");
	}

	public get copyCodeToClipboardField(): Locator {
		return this.affiliatesContainer.locator("input[name=copyToClipboard]");
	}
}
