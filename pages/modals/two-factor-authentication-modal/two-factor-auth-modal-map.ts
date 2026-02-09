import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TwoFactorAuthModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get popup2FaContainer(): Locator {
		return this.page.getByTestId("verify-2fa-v4-container");
	}

	public get inputFields2FACode(): Locator {
		return this.popup2FaContainer.locator(
			`input[data-testid^="verify-2fa-v4-pin-code-input-"]`,
		);
	}

	public get confirm2FAActivationCodeButton(): Locator {
		return this.popup2FaContainer.getByTestId(
			"verify-2fa-v4-confirm-button",
		);
	}
}
