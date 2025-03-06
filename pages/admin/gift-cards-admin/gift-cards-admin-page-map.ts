import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";
export class GiftCardsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private getContainerByTitle(title: string): Locator {
		return this.page.locator(
			`//div[contains(@class, 'MuiBox-root')]//h3[text()='${title}']/parent::div[contains(@class, 'MuiBox-root')]`,
		);
	}

	public get giftCardSettingsContainer(): Locator {
		return this.getContainerByTitle("Gift Card Settings");
	}

	public get giftCardGeneratorContainer(): Locator {
		return this.getContainerByTitle("Gift Card Generator");
	}

	public get giftCardGeneratorValueDropdown(): Locator {
		return this.getComboboxWithText(
			"Select a value",
			this.giftCardGeneratorContainer,
		);
	}

	public get giftCardGeneratorQuantityDropdown(): Locator {
		return this.getComboboxWithText(
			"Select a quantity",
			this.giftCardGeneratorContainer,
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
		return this.page.locator("button[class*=AdminGiftCardGenerator]", {
			has: this.page.locator("span", { hasText: "Generate & Download" }),
		});
	}
}
