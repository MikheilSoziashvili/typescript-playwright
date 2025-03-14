import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class NewUsersAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get newUsersAdminPageContent(): Locator {
		return this.page.getByTestId("adminNewUsersPageContent");
	}

	public get fetchNewUsersSettingsContainer(): Locator {
		return this.newUsersAdminPageContent.getByTestId(
			"fetchNewUsersSettingsContainer",
		);
	}

	public get fetchNewUsersSettingsHeader(): Locator {
		return this.fetchNewUsersSettingsContainer.getByTestId(
			"fetchNewUsersSettingsTitle",
		);
	}
}
