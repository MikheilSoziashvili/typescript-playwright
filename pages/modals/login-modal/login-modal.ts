import { BaseModal } from "@base/base-modal";
import { TestUserConfigurationObject } from "@core/types/types";
import { findUser } from "@core/utils/utils";
import { Toast } from "@pages/components/toast/toast";
import { expect, Page } from "@playwright/test";
import { step } from "decorators/step";
import { LoginModalAsserter } from "./login-modal-asserter";
import { LoginModalMap } from "./login-modal-map";
import { LoginModalSteps } from "./login-modal-steps";

export class LoginModal extends BaseModal<LoginModalMap> {
	public toast: Toast;

	constructor(page: Page) {
		super(page, new LoginModalMap(page));
		this.toast = new Toast(page);
	}

	public assertThat(fromCsv = false): LoginModalAsserter {
		return new LoginModalAsserter(this, fromCsv);
	}

	public steps(): LoginModalSteps {
		return new LoginModalSteps(this);
	}

	// TODO: Add test data in a separate class
	@step("Fill in credentials")
	public async fillInCredentials(
		username: string,
		password: string,
	): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.usernameField.blur();

		await this.map.passwordField.fill(password);
		await this.map.passwordField.blur();
	}

	@step("Login with credentials")
	public async login(username: string, password: string): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.passwordField.fill(password);
		await this.map.loginBtn.click();
	}

	@step("Enter 2FA code")
	public async enter2FaCode(
		twoFactorAuthenticationCode: string,
	): Promise<void> {
		await this.assertThat().checkElementsAreVisible([
			this.map.login2FaContainer,
		]);
		const inputCount = await this.map.inputFields2FACode.count();
		expect(inputCount).toBe(twoFactorAuthenticationCode.length);
		for (let i = 0; i < inputCount; i++) {
			const inputDigit = this.map.inputFields2FACode.nth(i);
			await inputDigit.fill(twoFactorAuthenticationCode[i]);
		}
	}

	@step("Click Steam button")
	public async clickSteamButton(): Promise<void> {
		await this.map.steamButton.click();
	}

	@step("Click Google button")
	public async clickGoogleButton(): Promise<void> {
		await this.map.googleButton.click();
	}

	@step("Login as user")
	public async loginAsUser(usernm: string): Promise<void> {
		const user: TestUserConfigurationObject | undefined = findUser({
			username: usernm,
		});
		if (user) {
			await this.map.usernameField.fill(user.username);
			await this.map.passwordField.fill(user.password);
			await this.map.loginBtn.click();
		}
	}

	@step("Click reset password button")
	public async clickForgotPasswordLink(): Promise<void> {
		await this.map.forgotPasswordLink.click();
	}

	@step("Fill in email for forgot password")
	public async fillInEmailForForgotPassword(email: string): Promise<void> {
		await this.map.forgotPasswordEmailField.fill(email);
	}

	@step("Fill in email")
	public async fillInEmail(email: string): Promise<void> {
		await this.map.emailInput.fill(email);
	}

	@step("Click send new password button")
	public async clickSendButtonForForgotPassword(): Promise<void> {
		await this.map.forgotPasswordSendButton.click();
	}

	@step("Set new password")
	public async setNewPassword(password: string): Promise<void> {
		await this.map.newPasswordInput.fill(password);
		await this.map.newPasswordConfirmationInput.fill(password);
		await this.map.setNewPasswordButton.click();
	}

	@step("Close forgot password form")
	public async closeForgotPasswordForm(): Promise<void> {
		await this.map.forgotPasswordCloseButton.click();
	}
}
