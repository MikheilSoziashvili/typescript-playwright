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

	public get titleDropdown(): Locator {
		return this.page
			.getByTestId("titleDropdownInput")
			.getByRole("combobox");
	}

	public get selectTitleOption(): Locator {
		return this.page.getByRole("option", { name: "Mr." });
	}

	public get firstNameInput(): Locator {
		return this.page.getByLabel("First Name");
	}

	public get lastNameInput(): Locator {
		return this.page.getByLabel("Last Name");
	}

	public get dateOfBirthInput(): Locator {
		return this.page.getByLabel("Birth date");
	}

	public get addressInput(): Locator {
		return this.page.getByLabel("Address").first();
	}

	public get cityInput(): Locator {
		return this.page.getByLabel("City");
	}

	public get postalCodeInput(): Locator {
		return this.page.getByLabel("Zip / Postal Code");
	}

	public get stateProvinceInput(): Locator {
		return this.page.getByLabel("State/Province");
	}

	public get countryDropdownInput(): Locator {
		return this.page.getByTestId("countryDropdownPlaceholder");
	}

	public get verifyCheckbox(): Locator {
		return this.page.locator('span[role="button"]', {
			has: this.page.locator(
				'input[type="checkbox"][class*="PrivateSwitchBase-input"]',
			),
		});
	}

	public get submitButton(): Locator {
		return this.page.locator("button", { hasText: "Submit Information" });
	}
}
