import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { ChangePasswordModalMap } from "./change-password-modal-map";
import { step } from "decorators/step";
import { ChangePasswordModalAsserter } from "./change-password-modal-asserter";
import { ChangePasswordModalSteps } from "./change-password-modal-steps";

export class ChangePasswordModal extends BaseModal<ChangePasswordModalMap> {
	constructor(page: Page) {
		super(page, new ChangePasswordModalMap(page));
	}

	public assertThat(): ChangePasswordModalAsserter {
		return new ChangePasswordModalAsserter(this);
	}

	public steps(): ChangePasswordModalSteps {
		return new ChangePasswordModalSteps(this);
	}

	@step("Fill old password")
	public async fillOldPassword(password: string): Promise<void> {
		await this.map.oldPasswordInput.fill(password);
	}

	@step("Fill new password")
	public async fillNewPassword(password: string): Promise<void> {
		await this.map.newPasswordInput.fill(password);
	}

	@step("Fill repeat new password")
	public async fillRepeatNewPassword(password: string): Promise<void> {
		await this.map.repeatNewPasswordInput.fill(password);
	}

	@step("Click change password button")
	public async clickChangePasswordButton(): Promise<void> {
		await this.map.changePasswordButton.click();
	}

	@step("Change password")
	public async changePassword(
		oldPassword: string,
		newPassword: string,
	): Promise<void> {
		await this.fillOldPassword(oldPassword);
		await this.fillNewPassword(newPassword);
		await this.fillRepeatNewPassword(newPassword);
		await this.clickChangePasswordButton();
	}
}
