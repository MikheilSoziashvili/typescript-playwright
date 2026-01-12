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

	public getIgnoredUserV4(username: string): Locator {
		return this.page.getByText(username, { exact: true });
	}

	public getUnignoreButtonV4(username: string): Locator {
		const row = this.getIgnoredUserV4(username)
			.locator("..")
			.locator("..");
		return row.locator('svg[class*="StyledCloseIcon"]');
	}
}
