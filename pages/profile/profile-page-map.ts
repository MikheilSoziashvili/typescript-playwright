import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class ProfilePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
	public get leftMenu(): Locator {
		return this.page.getByTestId("profileLeftMenu");
	}

	public get logOutButton(): Locator {
		return this.leftMenu.locator("button:has(p:text-is('Log out'))");
	}

	public get hideStatisticsToggle(): Locator {
		return this.page.getByTestId("profileHideStatistics").locator("input");
	}

	public get verifyButton(): Locator {
		return this.page.locator("button:has-text('Verify')");
	}

	public get continueVerificationButton(): Locator {
		return this.page.locator('button:has-text("Continue")');
	}

	public get changeEmailButton(): Locator {
		return this.page.locator('(//button[text()="Change"])[2]');
	}

	public get changeEmailInput(): Locator {
		return this.page.locator('input[name="email"]');
	}

	public get saveEmailButton(): Locator {
		return this.page.locator('(//button[text()="Save"])[1]');
	}
}
