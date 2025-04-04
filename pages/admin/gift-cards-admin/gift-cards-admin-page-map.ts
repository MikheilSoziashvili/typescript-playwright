import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class GiftCardsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private giftCardPageContentContainer(): Locator {
		return this.page.getByTestId("giftCardPageContent");
	}

	public get giftCardSettingsContainer(): Locator {
		return this.giftCardPageContentContainer().getByTestId(
			"giftCardSettingsContainer",
		);
	}

	public get giftCardGeneratorContainer(): Locator {
		return this.giftCardPageContentContainer().getByTestId(
			"giftCardGeneratorContainer",
		);
	}

	public get giftCardGeneratorValueDropdown(): Locator {
		return this.giftCardGeneratorContainer.getByTestId(
			"valueDropdownSelect",
		);
	}

	public get giftCardGeneratorQuantityDropdown(): Locator {
		return this.giftCardGeneratorContainer.getByTestId(
			"quantityDropdownSelect",
		);
	}

	public get dropdownContainer(): Locator {
		return this.page.locator("ul[role=listbox]");
	}

	public giftCardValueDropdownValue(value: string): Locator {
		return this.getDropdownOptionSelector(value, this.dropdownContainer);
	}

	public giftCardQuantityDropdownValue(quantity: string): Locator {
		return this.getDropdownOptionSelector(quantity, this.dropdownContainer);
	}

	public get generateAndDownloadButton(): Locator {
		return this.giftCardGeneratorContainer.getByTestId("generateButton");
	}
}
