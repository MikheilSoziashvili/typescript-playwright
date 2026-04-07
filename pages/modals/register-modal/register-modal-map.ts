import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class RegisterModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get registerDialog(): Locator {
		return this.page.getByTestId("auth-modal-signup-dialog");
	}

	public get registerForm(): Locator {
		return this.page.getByTestId("signup-form");
	}

	public get singUpModal(): Locator {
		return this.page.getByTestId("signUpFormModalAuthPopup");
	}

	public get usernameContainer(): Locator {
		return this.registerForm.getByTestId("sup-username");
	}

	public get passwordContainer(): Locator {
		return this.registerForm.getByTestId("sup-password");
	}

	public get emailContainer(): Locator {
		return this.registerForm.getByTestId("sup-email");
	}

	public get usernameField(): Locator {
		return this.usernameContainer.getByTestId("sup-username-input");
	}

	public get passwordField(): Locator {
		return this.passwordContainer.getByTestId("sup-password-input");
	}

	public get emailField(): Locator {
		return this.emailContainer.getByTestId("sup-email-input");
	}

	public get termsOfServiceCheckboxContainer(): Locator {
		return this.registerForm.getByTestId("sup-age-consent-chk");
	}

	public get termsOfServiceCheckbox(): Locator {
		return this.termsOfServiceCheckboxContainer.getByTestId(
			"sup-age-consent-chk-container",
		);
	}

	public get termsOfServiceCheckboxVisual(): Locator {
		return this.termsOfServiceCheckboxContainer.getByTestId(
			"sup-age-consent-chk-visual",
		);
	}

	public get startPlayingBtn(): Locator {
		return this.registerForm.getByTestId("signup-submit-button");
	}
}
