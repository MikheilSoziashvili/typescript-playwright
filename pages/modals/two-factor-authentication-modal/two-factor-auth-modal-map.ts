import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TwoFactorAuthModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get popup2FaContainer(): Locator {
		return this.page.locator(
			"//h5[normalize-space()='2FA Verification']//ancestor::div[contains(@class,'MuiPaper-root')]",
		);
	}

	public get inputFields2FACode(): Locator {
		return this.popup2FaContainer.locator(`input[id*="2fa-"]`);
	}

	public get confirm2FAActivationCodeButton(): Locator {
		return this.popup2FaContainer.locator(
			`//button[normalize-space()='Confirm']`,
		);
	}
}
