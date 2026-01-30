import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UnauthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get loginBtn(): Locator {
		return this.page.getByTestId("signin-nav-btn");
	}

	public get signUpBtn(): Locator {
		return this.page.getByTestId("signup-nav-btn");
	}

	public get steamSignInButton(): Locator {
		return this.page.getByTestId("steamSignInButton");
	}

	public get googleSignInButton(): Locator {
		return this.page.getByTestId("googleSignInButton");
	}

	public get telegramSignInButton(): Locator {
		return this.page.getByTestId("telegramSignInButton");
	}
}
