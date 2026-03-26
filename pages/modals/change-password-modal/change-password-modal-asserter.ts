import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { ChangePasswordModal } from "./change-password-modal";
import { expect } from "@playwright/test";

export class ChangePasswordModalAsserter extends BaseAsserter<ChangePasswordModal> {
	public constructor(modal: ChangePasswordModal) {
		super(modal);
	}

	@step("Assert change password modal is displayed")
	public async isModalDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.modalContainer,
			this.gamdomPage.map.modalContent,
		]);
	}

	@step("Assert change password modal is not displayed")
	public async isModalNotDisplayed(): Promise<void> {
		await this.checkElementsAreHidden([
			this.gamdomPage.map.modalContainer,
		]);
	}


	@step("Assert change password button is enabled")
	public async changePasswordButtonIsEnabled(): Promise<void> {
		await expect(this.gamdomPage.map.changePasswordButton).toBeEnabled();
	}

	@step("Assert change password button is disabled")
	public async changePasswordButtonIsDisabled(): Promise<void> {
		await expect(this.gamdomPage.map.changePasswordButton).toBeDisabled();
	}

	@step("Assert validation error is displayed")
	public async validationErrorIs(expectedText: string): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.inputError(expectedText),
		]);
	}

	@step("Assert all password fields are visible")
	public async allPasswordFieldsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.oldPasswordInput,
			this.gamdomPage.map.newPasswordInput,
			this.gamdomPage.map.repeatNewPasswordInput,
		]);
	}
}

