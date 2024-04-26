import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../../base/base-map";

export class UnauthenticatedHeaderMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get loginBtn(): Locator {
		return this.page.getByTestId("signin-nav");
	}

	public get signUpBtn(): Locator {
		return this.page.getByTestId("signup-nav");
	}
}
