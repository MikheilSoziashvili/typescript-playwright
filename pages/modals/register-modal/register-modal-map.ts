import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

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

	public get termsOfServiceCheckbox(): Locator {
		return this.page.getByTestId("agree-terms-signup").locator("span");
	}

	public get checkedTermsOfServiceCheckbox(): Locator {
		return this.page
			.getByTestId("agree-terms-signup")
			.locator("span[class*=checked]");
	}

	public get newsAndOffersCheckbox(): Locator {
		return this.page.getByTestId("want-news-signup").locator("span");
	}

	public get checkedNewsAndOffersCheckbox(): Locator {
		return this.page
			.getByTestId("want-news-signup")
			.locator("span[class*=checked]");
	}

	public get startPlayingBtn(): Locator {
		return this.page.getByTestId("start-playing-signup");
	}
}
