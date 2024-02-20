import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../../pages/base/base-map";

export class RegisterModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get usernameField(): Locator {
		return this.page.locator('input[name="username"]');
	}

	public get passwordField(): Locator {
		return this.page.locator('input[name="password"]');
	}

	public get emailField(): Locator {
		return this.page.locator('input[name="email"]');
	}

	// @TODO: Locator to be updated accordingly using data-testid
	public get termsOfServiceCheckbox(): Locator {
		return this.page
			.locator("label")
			.filter({ hasText: "I certify that I am at least" })
			.locator("rect");
	}

	// @TODO: Locator to be updated accordingly using data-testid
	public get newsAndOffersCheckbox(): Locator {
		return this.page
			.locator("label")
			.filter({ hasText: "I want to receive News and" })
			.locator("rect");
	}

	public get startPlayingBtn(): Locator {
		return this.page.getByTestId("start-playing-signup");
	}
}
