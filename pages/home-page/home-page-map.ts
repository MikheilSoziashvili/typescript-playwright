import { Locator, Page } from "@playwright/test";
import { BaseMap } from "base/base-map";

export class HomePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get toastMessage(): Locator {
		return this.page.locator("*[role='alert']");
	}

	public get registerSuccessMessage(): Locator {
		return this.page.locator("p[type='success']");
	}

	public get welcomeBackMessage(): Locator {
		return this.page.locator(
			"[class*='Welcome-styled__WelcomeText'] + span",
		);
	}
}
