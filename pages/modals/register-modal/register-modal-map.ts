import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class RegisterModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get singUpModal(): Locator {
		return this.page.getByTestId("signUpFormModalAuthPopup");
	}

	public get usernameContainer(): Locator {
		return this.singUpModal.getByTestId("username-signup");
	}

	public get passwordContainer(): Locator {
		return this.singUpModal.getByTestId("passwordInputContainer");
	}

	public get emailContainer(): Locator {
		return this.singUpModal.getByTestId("email-signup");
	}

	public get usernameField(): Locator {
		return this.getInputField("username", this.usernameContainer);
	}

	public get passwordField(): Locator {
		return this.getInputField("password", this.passwordContainer);
	}

	public get emailField(): Locator {
		return this.getInputField("email", this.emailContainer);
	}

	public get termsOfServiceCheckbox(): Locator {
		return this.page.getByTestId("agree-terms-signup").locator("span");
	}

	public get newsAndOffersCheckbox(): Locator {
		return this.page.getByTestId("want-news-signup").locator("span");
	}

	public get startPlayingBtn(): Locator {
		return this.page.getByTestId("start-playing-signup");
	}

	public get registerDialogV4(): Locator {
		return this.page.getByTestId("auth-modal-dialog");
	}

	public get registerFormV4(): Locator {
		return this.registerDialogV4.getByTestId("signup-form");
	}

	public get usernameContainerV4(): Locator {
		return this.registerFormV4.getByTestId("sup-username");
	}

	public get passwordContainerV4(): Locator {
		return this.registerFormV4.getByTestId("sup-password");
	}

	public get emailContainerV4(): Locator {
		return this.registerFormV4.getByTestId("sup-email");
	}

	public get usernameFieldV4(): Locator {
		return this.usernameContainerV4.getByTestId("sup-username-input");
	}

	public get passwordFieldV4(): Locator {
		return this.passwordContainerV4.getByTestId("sup-password-input");
	}

	public get emailFieldV4(): Locator {
		return this.emailContainerV4.getByTestId("sup-email-input");
	}

	public get termsOfServiceCheckboxV4(): Locator {
		return this.registerFormV4.getByTestId("sup-age-consent-chk");
	}

	public get newsAndOffersCheckboxV4(): Locator {
		return this.registerFormV4.getByTestId("sup-email-consent-chk");
	}

	public get startPlayingBtnV4(): Locator {
		return this.registerFormV4.getByTestId("signup-submit-button");
	}
}
