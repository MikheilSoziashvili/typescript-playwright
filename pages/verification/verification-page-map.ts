import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VerificationPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get verificationPageContainer(): Locator {
		return this.page.getByTestId("page-container");
	}

	public get verificationPageTitle(): Locator {
		return this.verificationPageContainer.locator("h1", {
			hasText: "Verification",
		});
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
