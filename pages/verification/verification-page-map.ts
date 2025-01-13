import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class VerificationPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get countryDropdownContainer(): Locator {
		return this.page.locator("div[class*='DropdownContainer']").filter({
			has: this.page.locator("label", { hasText: "Country" }),
		});
	}

	public get countryDropdown(): Locator {
		return this.countryDropdownContainer
			.locator(`div`)
			.getByRole("combobox", { exact: true })
			.and(this.page.locator(`[aria-haspopup='listbox']`));
	}

	public get countryDropdownValuesContainer(): Locator {
		return this.page.locator(`ul[role='listbox'][class*='-list']`);
	}

	public get countryDropdownValueItems(): Locator {
		return this.countryDropdownValuesContainer
			.locator("li")
			.getByRole("option");
	}
}
