import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";
export class SecurityAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get withdrawSettingsHeader(): Locator {
		return this.page.locator('h3:text-is("Withdraw settings")');
	}

	public get saveButton(): Locator {
		return this.page.locator('button:has-text("Save")');
	}

	public get blockUserInput(): Locator {
		return this.page.locator(
			'div.field_group:has-text("Block user if withdraws (24h) are higher") input[type="number"]',
		);
	}

	public get alertUserInput(): Locator {
		return this.page.locator(
			'div.field_group:has-text("Alert if user\'s withdraws (24h) are higher") input[type="number"]',
		);
	}
}
