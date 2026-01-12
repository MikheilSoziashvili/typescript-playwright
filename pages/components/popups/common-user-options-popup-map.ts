import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { CommonUserPopupOption } from "@enums/common-user-popup-options";

export class CommonUserOptionsPopupMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get popupLocator(): Locator {
		return this.page.locator(
			"div[role=tooltip] div[class*=CommonUserOptionsPopup]",
		);
	}

	public popupOption(option: CommonUserPopupOption): Locator {
		return this.popupLocator.locator("ul li").filter({ hasText: option });
	}

	public get popupLocatorV4(): Locator {
		return this.page.locator('div[class*="PopoverV4"] div[role="listbox"]');
	}

	public popupOptionV4(option: CommonUserPopupOption): Locator {
		return this.popupLocatorV4.locator(
			`[data-testid$="-messageActions-option-${option.toLowerCase()}"]`,
		);
	}
}
