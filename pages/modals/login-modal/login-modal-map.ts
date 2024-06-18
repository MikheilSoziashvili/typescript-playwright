import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class LoginModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get usernameField(): Locator {
		return this.page.locator('input[name="username"]');
	}

	public get passwordField(): Locator {
		return this.page.locator('input[name="password"]');
	}

	public get loginBtn(): Locator {
		return this.page.getByTestId("start-playing-login");
	}

	public get usernameFieldErrorIcon(): Locator {
		return this.page
			.locator("div[class*='MuiTextField-root']:nth-child(1)")
			.locator("i[class*='icon-remove']");
	}

	public get passwordFieldErrorIcon(): Locator {
		return this.page
			.locator("div[class*='MuiTextField-root']:nth-child(2)")
			.locator("i[class*='icon-remove']");
	}

	public get fieldErrorTooltip(): Locator {
		return this.page.locator("*[role='tooltip']");
	}

	public get steamButton(): Locator {
		return this.page
			.locator("div[class*=PopupSocialWrapper] button")
			.first();
	}
}
