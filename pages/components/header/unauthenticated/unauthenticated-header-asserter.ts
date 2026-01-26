import { BaseAsserter } from "@base/base-asserter";
import { oAuthAccount } from "@enums/oAuth-accounts";
import { Locator } from "@playwright/test";
import { step } from "decorators/step";
import { UnauthenticatedHeader } from "./unauthenticated-header";

export class UnauthenticatedHeaderAsserter extends BaseAsserter<UnauthenticatedHeader> {
	public constructor(unauthenticatedHeader: UnauthenticatedHeader) {
		super(unauthenticatedHeader);
	}

	@step("Check logged out user elements are visible")
	async loggedOutUserElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.loginBtn,
			this.gamdomPage.map.signUpBtn,
		]);
	}

	@step("Check create account button is disabled")
	async isCreateAccountButtonDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([this.gamdomPage.map.signUpBtn]);
	}

	@step("Check Sign In button is disabled")
	async isSignInButtonDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([this.gamdomPage.map.loginBtn]);
	}

	@step("Check social login options are visible")
	async socialLoginOptionsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.steamSignInButton,
			this.gamdomPage.map.googleSignInButton,
			this.gamdomPage.map.telegramSignInButton,
		]);
	}

	@step("Ensure OAuth provider is enabled (visible + enabled)")
	async ensureOAuthEnabled(button: Locator): Promise<void> {
		await this.checkElementsAreVisible([button]);
		await this.checkElementsAreEnabled([button]);
	}

	@step("Ensure OAuth provider is disabled")
	async ensureOAuthDisabled(button: Locator): Promise<void> {
		await this.checkElementsAreDisabled([button]);
	}

	@step("Ensure all OAuth providers are enabled")
	async ensureAllOAuthEnabled(): Promise<void> {
		await this.ensureOAuthEnabled(this.gamdomPage.map.steamSignInButton);
		await this.ensureOAuthEnabled(this.gamdomPage.map.googleSignInButton);
		await this.ensureOAuthEnabled(this.gamdomPage.map.telegramSignInButton);
	}

	@step("Check OAuth provider is enabled/disabled")
	async oAuthIsEnabled(
		provider: oAuthAccount,
		expected: boolean,
	): Promise<void> {
		const buttonMap = {
			[oAuthAccount.STEAM]: this.gamdomPage.map.steamSignInButton,
			[oAuthAccount.GOOGLE]: this.gamdomPage.map.googleSignInButton,
			[oAuthAccount.TELEGRAM]: this.gamdomPage.map.telegramSignInButton,
		};

		const button = buttonMap[provider];

		await (expected
			? this.ensureOAuthEnabled(button)
			: this.ensureOAuthDisabled(button));
	}

	@step("Verify OAuth buttons match expected rules")
	async oAuthButtonsMatch(expects: {
		steam: boolean;
		google: boolean;
		telegram: boolean;
	}): Promise<void> {
		if (expects.steam && expects.google && expects.telegram) {
			return this.ensureAllOAuthEnabled();
		}

		await this.oAuthIsEnabled(oAuthAccount.STEAM, expects.steam);
		await this.oAuthIsEnabled(oAuthAccount.GOOGLE, expects.google);
		await this.oAuthIsEnabled(oAuthAccount.TELEGRAM, expects.telegram);
	}

	@step("Check logged out user elements are visible - v4")
	async loggedOutUserElementsAreVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.loginBtnV4,
			this.gamdomPage.map.signUpBtnV4,
		]);
	}
}
