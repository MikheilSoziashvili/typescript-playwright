import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class NewUsersAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get fetchNewUsersSettingsHeader(): Locator {
		return this.page.locator(
			'h3.title:text-is("Fetch new users settings")',
		);
	}
}
