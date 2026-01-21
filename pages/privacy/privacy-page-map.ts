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
		const row = this.getIgnoredUserV4(username).locator("..").locator("..");
		return row.locator('svg[class*="StyledCloseIcon"]');
	}

	public get hideDetailsRowV4(): Locator {
		return this.page.getByTestId("hide-details-from-users").locator("..");
	}

	public get hideStatisticsRowV4(): Locator {
		return this.page.getByTestId("hide-statistics-from-users").locator("..");
	}

	public get hideDetailsToggleV4(): Locator {
		return this.hideDetailsRowV4.locator(
			"input[type='checkbox'][role='switch']",
		);
	}

	public get hideDetailsToggleClickTargetV4(): Locator {
		return this.hideDetailsRowV4.locator("label");
	}

	public get hideStatisticsToggleV4(): Locator {
		return this.hideStatisticsRowV4.locator(
			"input[type='checkbox'][role='switch']",
		);
	}

	public get hideStatisticsToggleClickTargetV4(): Locator {
		return this.hideStatisticsRowV4.locator("label");
	}
}
