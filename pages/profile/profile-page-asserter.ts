import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { ProfilePage } from "./profile-page";
import { expect } from "@playwright/test";

export class ProfilePageAsserter extends BaseAsserter<ProfilePage> {
	public constructor(page: ProfilePage) {
		super(page);
	}

	@step("Assert verify button is not visible")
	public async assertVerifyButtonNotVisible(): Promise<void> {
		await expect(this.gamdomPage.map.verifyButton).toBeHidden();
	}

	@step("Assert email input is visible")
	public async assertEmailInputVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.changeEmailInput],
			undefined,
			"Email input should be visible after email change",
		);
	}

	@step("Assert phone input is visible")
	public async assertPhoneInputVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.changePhoneInput,
		]);
	}

	@step("Assert username validation error is")
	public async usernameValidationErrorIs(
		errorText: string,
	): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.usernameValidationError,
				expectedText: errorText,
			},
		]);
	}

	@step("Assert save username button is disabled")
	public async saveUsernameButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.saveUsernameButton,
		]);
	}

	@step("Assert email validation error is")
	public async emailValidationErrorIs(errorText: string): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.emailValidationError,
				expectedText: errorText,
			},
		]);
	}

	@step("Assert save email button is disabled")
	public async saveEmailButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.saveEmailButton,
		]);
	}

	@step("Assert save email button is enabled")
	public async saveEmailButtonIsEnabled(): Promise<void> {
		await this.checkElementsAreEnabled([
			this.gamdomPage.map.saveEmailButton,
		]);
	}

	@step("Assert phone validation error is")
	public async phoneValidationErrorIs(errorText: string): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.phoneValidationError,
				expectedText: errorText,
			},
		]);
	}

	@step("Assert save phone button is disabled")
	public async savePhoneButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.savePhoneButton,
		]);
	}
}
