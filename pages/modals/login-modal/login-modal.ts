import { expect, Page } from "@playwright/test";
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
	public async fillInCredentials(
		username: string,
		password: string,
	): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.usernameField.blur();

		await this.map.passwordField.fill(password);
		await this.map.passwordField.blur();
	}

	public async login(username: string, password: string): Promise<void> {
		await this.map.usernameField.fill(username);
		await this.map.passwordField.fill(password);
		await this.map.loginBtn.click();
	}

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

	public async clickSteamButton(): Promise<void> {
		await this.map.steamButton.click();
	}

	public async clickGoogleButton(): Promise<void> {
		await this.map.googleButton.click();
	}

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

	public async clickResetPasswordButton(): Promise<void> {
		await this.map.forgotPasswordButton.click();
	}

	public async fillInEmail(email: string): Promise<void> {
		await this.map.emailInput.fill(email);
	}
	public async clickSendNewPasswordButton(): Promise<void> {
		await this.map.sendNewPasswordButton.click();
	}

	public async setNewPassword(password: string): Promise<void> {
		await this.map.newPasswordInput.fill(password);
		await this.map.newPasswordConfirmationInput.fill(password);
		await this.map.setNewPasswordButton.click();
	}
}
