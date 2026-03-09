import { BaseTestFlow, testFlow } from "@test-flows";
import { ChangePasswordModal } from "@pages/modals/change-password-modal/change-password-modal";
import { Toast } from "@pages/components/toast/toast";
import { mapCsvPassword } from "test-data/interfaces/domain/password-domain-interfaces";
import { ChangePasswordCsvRecord } from "@dtos/csv/change-password-csv";

export class PasswordChangeExecutionTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Execute password change")
	public async executePasswordChange(params: {
		changePasswordModal: ChangePasswordModal;
		toast: Toast;
		input: ChangePasswordCsvRecord;
		userPassword: string;
	}): Promise<void> {
		const { changePasswordModal, toast, input, userPassword } = params;

		await changePasswordModal.fillOldPassword(
			mapCsvPassword(input.OldPassword, userPassword),
		);
		await changePasswordModal.fillNewPassword(
			mapCsvPassword(input.NewPassword, userPassword),
		);
		await changePasswordModal.fillRepeatNewPassword(
			mapCsvPassword(input.RepeatPassword, userPassword),
		);
		await changePasswordModal.clickChangePasswordButton();

		await toast.assertThat().subTitleIs(input.ExpectedResult);
	}
}
