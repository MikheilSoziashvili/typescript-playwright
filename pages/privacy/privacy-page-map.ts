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
		const row = this.getIgnoredUser(username).locator("..").locator("..");
		return row.locator('svg[class*="StyledCloseIcon"]');
	}

	public get hideDetailsRow(): Locator {
		return this.page.getByTestId("hide-details-from-users").locator("..");
	}

	public get hideStatisticsRow(): Locator {
		return this.page
			.getByTestId("hide-statistics-from-users")
			.locator("..");
	}

	public get hideDetailsToggle(): Locator {
		return this.hideDetailsRow.locator(
			"input[type='checkbox'][role='switch']",
		);
	}

	public get hideDetailsToggleClickTarget(): Locator {
		return this.hideDetailsRow.locator("label");
	}

	public get hideStatisticsToggle(): Locator {
		return this.hideStatisticsRow.locator(
			"input[type='checkbox'][role='switch']",
		);
	}

	public get hideStatisticsToggleClickTarget(): Locator {
		return this.hideStatisticsRow.locator("label");
	}
}
