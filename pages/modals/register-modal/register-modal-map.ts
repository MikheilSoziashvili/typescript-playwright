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
}
