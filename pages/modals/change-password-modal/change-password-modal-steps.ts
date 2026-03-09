import { BaseModalStep } from "@pages/base/base-modal-step";
import { ChangePasswordModal } from "./change-password-modal";
import { step } from "decorators/step";

export class ChangePasswordModalSteps extends BaseModalStep<ChangePasswordModal> {
	public constructor(gamdomModal: ChangePasswordModal) {
		super(gamdomModal);
	}

	@step("Change password successfully")
	public async changePasswordSuccessfully(
		oldPassword: string,
		newPassword: string,
	): Promise<void> {
		await this.gamdomModal.assertThat().isModalDisplayed();
		await this.gamdomModal.changePassword(oldPassword, newPassword);
	}

	@step("Fill all password fields")
	public async fillAllPasswordFields(
		oldPassword: string,
		newPassword: string,
	): Promise<void> {
		await this.gamdomModal.fillOldPassword(oldPassword);
		await this.gamdomModal.fillNewPassword(newPassword);
		await this.gamdomModal.fillRepeatNewPassword(newPassword);
	}
}

