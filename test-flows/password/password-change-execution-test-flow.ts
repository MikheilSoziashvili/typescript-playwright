import { BaseTestFlow, testFlow } from "@test-flows";
import { ChangePasswordModal } from "@pages/modals/change-password-modal/change-password-modal";
import { Toast } from "@pages/components/toast/toast";
import {
	ChangePasswordCsvParsedRecord,
	mapCsvPassword,
} from "test-data/parsers/change-password-csv-parser";

export class PasswordChangeExecutionTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Execute password change")
	public async executePasswordChange(params: {
		changePasswordModal: ChangePasswordModal;
		toast: Toast;
		input: ChangePasswordCsvParsedRecord;
		userPassword: string;
	}): Promise<void> {
		const { changePasswordModal, toast, input, userPassword } = params;

		const fieldActions: [string | null, (value: string) => Promise<void>][] = [
			[input.oldPassword, (v) => changePasswordModal.fillOldPassword(v)],
			[input.newPassword, (v) => changePasswordModal.fillNewPassword(v)],
			[input.repeatPassword, (v) => changePasswordModal.fillRepeatNewPassword(v)],
		];

		for (const [value, fill] of fieldActions) {
			if (value !== null) {
				await fill(mapCsvPassword(value, userPassword));
			}
		}

		if (!input.isSubmitButtonActive) {
			await changePasswordModal
				.assertThat()
				.changePasswordButtonIsDisabled();
			await changePasswordModal
				.assertThat()
				.validationErrorIs(input.expectedResult);
			return;
		}

		await changePasswordModal.assertThat().changePasswordButtonIsEnabled();
		await changePasswordModal.clickChangePasswordButton();

		const { expectedToastTitle } = input;
		if (!expectedToastTitle) {
			await toast.assertThat().subTitleIs(input.expectedResult);
			return;
		}

		await toast
			.assertThat()
			.titleIs(expectedToastTitle as string, {
				subTitle: input.expectedResult,
			});
	}
}
