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

	public get emailNumberContainer(): Locator {
		return this.page.getByTestId("profileEmailContainer");
	}

	public get changeEmailButton(): Locator {
		return this.emailNumberContainer.locator("button", {
			hasText: "Change",
		});
	}

	public get changeEmailInput(): Locator {
		return this.getInputField("email", this.emailNumberContainer);
	}

	public get saveEmailButton(): Locator {
		return this.emailNumberContainer.locator("button", {
			hasText: "Save",
		});
	}

	public get phoneNumberContainer(): Locator {
		return this.page.getByTestId("profilePhoneContainer");
	}

	public get changePhoneButton(): Locator {
		return this.phoneNumberContainer.locator("button", {
			hasText: "Change",
		});
	}

	public get changePhoneInput(): Locator {
		return this.getInputField("phone", this.phoneNumberContainer);
	}

	public get savePhoneButton(): Locator {
		return this.phoneNumberContainer.locator("button", {
			hasText: "Save",
		});
	}
}
