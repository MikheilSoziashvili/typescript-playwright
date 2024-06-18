import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class SteamAuthPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get loginForm(): Locator {
		return this.page.locator("div[data-featuretarget=login] form");
	}

	public get usernameTextInput(): Locator {
		return this.loginForm.locator("input[type=text]");
	}

	public get passwordTextInput(): Locator {
		return this.loginForm.locator("input[type=password]");
	}

	public get signInButton(): Locator {
		return this.loginForm.locator('button[type=submit]:text-is("Sign in")');
	}
}
