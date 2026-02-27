import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class LoginModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get loginDialog(): Locator {
		return this.page.getByTestId("auth-modal-form-container");
	}

	public get loginForm(): Locator {
		return this.loginDialog.getByTestId("signin-form");
	}

	public get usernameContainer(): Locator {
		return this.loginForm.getByTestId("signin-username");
	}

	public get passwordContainer(): Locator {
		return this.loginForm.getByTestId("signin-password");
	}

	public get usernameField(): Locator {
		return this.usernameContainer.getByTestId("signin-username-input");
	}

	public get passwordField(): Locator {
		return this.passwordContainer.getByTestId("signin-password-input");
	}

	public get loginBtn(): Locator {
		return this.loginDialog.getByTestId("signin-sbt-btn");
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

	public get socialOptionsContainer(): Locator {
		return this.page.getByTestId("auth-social-buttons-container");
	}

	public get steamButton(): Locator {
		return this.socialOptionsContainer.getByTestId(
			"auth-social-steam-button",
		);
	}

	public get googleButton(): Locator {
		return this.socialOptionsContainer.getByTestId(
			"auth-social-google-button",
		);
	}

	public get login2FaContainer(): Locator {
		return this.page.getByTestId("auth-modal-form-container");
	}

	public get inputFields2FACode(): Locator {
		return this.login2FaContainer.locator(
			`input[data-testid^="signin-2fa-code-input-"]`,
		);
	}

	public get confirm2FAActivationCodeButton(): Locator {
		return this.login2FaContainer.getByTestId("signin-2fa-sbt-btn");
	}

	public get forgotPasswordDialog(): Locator {
		return this.page.getByTestId("auth-modal-login-dialog");
	}

	public get forgotPasswordForm(): Locator {
		return this.forgotPasswordDialog.getByTestId("forgot-password-form");
	}

	public get forgotPasswordEmailContainer(): Locator {
		return this.forgotPasswordForm.getByTestId(
			"forgot-password-email-container",
		);
	}

	public get forgotPasswordEmailField(): Locator {
		return this.forgotPasswordEmailContainer.getByTestId(
			"forgot-password-email-input",
		);
	}

	public get forgotPasswordLink(): Locator {
		return this.loginForm.getByTestId("forgot-pwd-link-btn");
	}

	public get forgotPasswordSendButton(): Locator {
		return this.forgotPasswordForm.getByTestId("forgot-pwd-sbt-btn");
	}

	public get emailInput(): Locator {
		return this.page.locator('input[placeholder="Enter your email"]');
	}

	public get forgotPasswordConfirmationText(): Locator {
		return this.forgotPasswordForm.getByTestId(
			"forgot-password-success-message",
		);
	}

	public get setNewPasswordButton(): Locator {
		return this.page.getByTestId("reset-pwd-sbt-btn");
	}

	public get newPasswordConfirmationInput(): Locator {
		return this.page.locator('input[name="newPasswordConfirmation"]');
	}

	public get newPasswordInput(): Locator {
		return this.page.locator('input[name="newPassword"]');
	}

	public get forgotPasswordCloseButton(): Locator {
		return this.forgotPasswordForm.getByTestId("forgot-pwd-close-btn");
	}

	public get usernameErrorTooltip(): Locator {
		return this.usernameContainer.getByTestId("signin-username-error");
	}

	public get passwordErrorTooltip(): Locator {
		return this.passwordContainer.getByTestId("signin-password-error");
	}
}
