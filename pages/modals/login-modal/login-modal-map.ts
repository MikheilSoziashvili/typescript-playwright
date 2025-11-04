import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class LoginModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get usernameContainer(): Locator {
		return this.page.getByTestId("username-login");
	}

	public get passwordContainer(): Locator {
		return this.page.getByTestId("passwordInputContainer");
	}

	public get usernameField(): Locator {
		return this.getInputField("username", this.usernameContainer);
	}

	public get passwordField(): Locator {
		return this.getInputField("password", this.passwordContainer);
	}

	public get loginBtn(): Locator {
		return this.page.getByTestId("start-playing-login");
	}

	public get usernameFieldErrorIcon(): Locator {
		return this.usernameContainer.getByTestId("clearInputButton");
	}

	public get passwordFieldErrorIcon(): Locator {
		return this.passwordContainer.getByTestId("clearInputButton");
	}

	public get fieldErrorTooltip(): Locator {
		return this.page.locator("*[role='tooltip']");
	}

	public get signInOptionsContainer(): Locator {
		return this.page.locator(
			"//div[contains(@class,'SignInOptionsContainer')]",
		);
	}

	public get steamButton(): Locator {
		return this.signInOptionsContainer.locator(
			"//i[contains(@class,'icon-steam')]//ancestor::button",
		);
	}

	public get googleButton(): Locator {
		return this.signInOptionsContainer.locator(
			"//i[contains(@class,'icon-google')]//ancestor::button",
		);
	}

	public get login2FaContainer(): Locator {
		return this.page.locator(
			"//*[text()='2FA Code']//ancestor::div[contains(@class,'MuiBox-root')]",
		);
	}

	public get inputFields2FACode(): Locator {
		return this.login2FaContainer.locator(`input[id*="2fa-"]`);
	}

	public get confirm2FAActivationCodeButton(): Locator {
		return this.login2FaContainer.locator(
			`//..//..//button[@type='button' and normalize-space()='Confirm']`,
		);
	}

	public get forgotPasswordButton(): Locator {
		return this.page.getByTestId("forgot-password-login");
	}

	public get sendNewPasswordButton(): Locator {
		return this.page.getByTestId("sendButton");
	}

	public get emailInput(): Locator {
		return this.page.locator('input[placeholder="Enter your email"]');
	}

	public get passwordResetConfirmationText(): Locator {
		return this.page.getByTestId("descriptionMessageText");
	}

	public get setNewPasswordButton(): Locator {
		return this.page.getByTestId("resetPasswordButton");
	}

	public get newPasswordConfirmationInput(): Locator {
		return this.page.locator('input[name="newPasswordConfirmation"]');
	}

	public get newPasswordInput(): Locator {
		return this.page.locator('input[name="newPassword"]');
	}

	public get loginDialogV4(): Locator {
		return this.page.getByTestId("auth-modal-dialog");
	}

	public get loginFormV4(): Locator {
		return this.loginDialogV4.getByTestId("signin-form");
	}

	public get usernameContainerV4(): Locator {
		return this.loginFormV4.getByTestId("signin-username");
	}

	public get passwordContainerV4(): Locator {
		return this.loginFormV4.getByTestId("signin-password");
	}

	public get usernameFieldV4(): Locator {
		return this.usernameContainerV4.getByTestId("signin-username-input");
	}

	public get passwordFieldV4(): Locator {
		return this.passwordContainerV4.getByTestId("signin-password-input");
	}

	public get loginBtnV4(): Locator {
		return this.loginDialogV4.getByTestId("signin-sbt-btn");
	}

	public get forgotPasswordButtonV4(): Locator {
		return this.loginFormV4.getByTestId("forgot-pwd-link-btn");
	}

	public get forgotPasswordFormV4(): Locator {
		return this.loginDialogV4.getByTestId("forgot-password-form");
	}

	public get forgotPasswordEmailContainerV4(): Locator {
		return this.forgotPasswordFormV4.getByTestId("forgot-password-email");
	}

	public get forgotPasswordEmailFieldV4(): Locator {
		return this.forgotPasswordEmailContainerV4.getByTestId(
			"forgot-password-email-input",
		);
	}

	public get forgotPasswordSendButtonV4(): Locator {
		return this.forgotPasswordFormV4.getByTestId("forgot-pwd-sbt-btn");
	}

	public get forgotPasswordConfirmationTextV4(): Locator {
		return this.forgotPasswordFormV4.getByTestId(
			"forgot-password-success-message",
		);
	}

	public get forgotPasswordCloseButtonV4(): Locator {
		return this.forgotPasswordFormV4.getByTestId("forgot-pwd-close-btn");
	}
}
