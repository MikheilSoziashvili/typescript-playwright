import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PrivacyPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get settingsContainer(): Locator {
		return this.page.getByTestId("userSettingsPageContent");
	}

	public getIgnoredUser(username: string): Locator {
		return this.page.getByText(username, { exact: true });
	}

	public getUnignoreButton(username: string): Locator {
		const row = this.getIgnoredUser(username)
			.locator("..")
			.locator("..")
			.locator("..");
		return row.getByRole("button", { name: "Unignore" });
	}
}
