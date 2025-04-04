import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VerificationPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get countryDropdownContainer(): Locator {
		return this.page.getByTestId("countryDropdownContainer");
	}

	public get countryDropdown(): Locator {
		return this.countryDropdownContainer
			.getByTestId("countryDropdownInput")
			.getByRole("combobox");
	}

	public get countryDropdownValuesContainer(): Locator {
		return this.page
			.getByTestId("countryDropdownListContainer")
			.getByRole("listbox");
	}

	public get countryDropdownValueItems(): Locator {
		return this.countryDropdownValuesContainer
			.locator("li")
			.getByRole("option");
	}
}
