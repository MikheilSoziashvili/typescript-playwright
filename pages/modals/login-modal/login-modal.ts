import { expect, Page } from "@playwright/test";
import { step } from "decorators/step";
import { BaseModal } from "@base/base-modal";
import { LoginModalMap } from "./login-modal-map";
import { LoginModalAsserter } from "./login-modal-asserter";
import { findUser } from "@core/utils/utils";
import { TestUserConfigurationObject } from "@core/types/types";

export class LoginModal extends BaseModal<LoginModalMap> {
	constructor(page: Page) {
		super(page, new LoginModalMap(page));
	}

	public assertThat(fromCsv = false): LoginModalAsserter {
		return new LoginModalAsserter(this, fromCsv);
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
	public async clickResetPasswordButton(): Promise<void> {
		await this.map.forgotPasswordButton.click();
	}

	@step("Fill in email")
	public async fillInEmail(email: string): Promise<void> {
		await this.map.emailInput.fill(email);
	}

	@step("Click send new password button")
	public async clickSendNewPasswordButton(): Promise<void> {
		await this.map.sendNewPasswordButton.click();
	}

	@step("Set new password")
	public async setNewPassword(password: string): Promise<void> {
		await this.map.newPasswordInput.fill(password);
		await this.map.newPasswordConfirmationInput.fill(password);
		await this.map.setNewPasswordButton.click();
	}
}
