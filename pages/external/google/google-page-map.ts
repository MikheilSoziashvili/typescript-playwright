import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class GooglePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gEmailField(): Locator {
		return this.page.locator("#identifierId");
	}

	public get gMoveForwardBtn(): Locator {
		return this.page.locator("[id='identifierNext']");
	}

	public get gPasswordField(): Locator {
		return this.page.locator("input[name='Passwd']");
	}

	public get gTwoFactorCodeField(): Locator {
		return this.page.locator("input[type='tel']");
	}

	public get gPasswordNextBtn(): Locator {
		return this.page.locator("[id='passwordNext']");
	}

	public get gTwoFactoryNextBtn(): Locator {
		return this.page.locator("[id='totpNext']");
	}
}
