import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
export class SettingsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get settingsContainer(): Locator {
		return this.page.locator(`[class*='ProfileContainerAnimate']`);
	}

	public get imageQRCode(): Locator {
		return this.page.locator(`[class="qrcode"]`);
	}
	public action2FaButtonByPlaceholder(placeholderText: string): Locator {
		return this.settingsContainer.locator(
			`//button[@type="button" and normalize-space()='${placeholderText}']`,
		);
	}
	public get enable2FAButton(): Locator {
		return this.action2FaButtonByPlaceholder(`Enable 2FA`);
	}
	public get disable2FAButton(): Locator {
		return this.action2FaButtonByPlaceholder(`Disable 2FA`);
	}
	public twoFactoryModalsByPlaceholder(placeholderText: string): Locator {
		return this.page.locator(
			`//h5[text()='${placeholderText}']//ancestor::div[contains(@class,'open')]`,
		);
	}
	public get activation2FAPopup(): Locator {
		return this.twoFactoryModalsByPlaceholder(`2FA Activation`);
	}
	public get verification2FAPopup(): Locator {
		return this.twoFactoryModalsByPlaceholder(`2FA Verification`);
	}
	public get fields2FACodeInputs(): Locator {
		return this.page.locator(`input[id*="2fa-"]`);
	}
	public get confirm2FAActivationCodeButton(): Locator {
		return this.activation2FAPopup.locator(
			`//button[@type='button' and normalize-space()='Confirm']`,
		);
	}
	public get disable2FaModalLocator(): Locator {
		return this.page.locator(
			`//img[@alt='Warning sign']//following-sibling::p[normalize-space()='Are you sure you want to disable your 2FA?']//ancestor::div[contains(@class,'MuiPaper-elevation')]`,
		);
	}
	public get continueDisable2FaButton(): Locator {
		return this.disable2FaModalLocator.locator(
			"//button[normalize-space()='Continue']",
		);
	}
	public get cancelDisable2FaButton(): Locator {
		return this.disable2FaModalLocator.locator(
			"//button[normalize-space()='Cancel']",
		);
	}
}
