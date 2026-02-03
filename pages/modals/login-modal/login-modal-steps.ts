import { BaseModalStep } from "@pages/base/base-modal-step";
import { LoginModal } from "./login-modal";
import { step } from "decorators/step";

export class LoginModalSteps extends BaseModalStep<LoginModal> {
	public constructor(gamdomModal: LoginModal) {
		super(gamdomModal);
	}

	@step("Send forgot password email successfully")
	public async sendForgotPasswordEmailSuccessfully(
		email: string,
		expectedText: string,
	): Promise<void> {
		await this.gamdomModal.clickForgotPasswordLink();
		await this.gamdomModal.fillInEmailForForgotPassword(email);
		await this.gamdomModal.clickSendButtonForForgotPassword();
		await this.gamdomModal
			.assertThat()
			.forgotPasswordConfirmationTextAndVisibility(expectedText);
	}

	@step("Close forgot password form")
	public async closeForgotPasswordFormAndVerify(): Promise<void> {
		await this.gamdomModal.closeForgotPasswordForm();
		await this.gamdomModal.assertThat().forgotPasswordFormIsNotVisible();
		await this.gamdomModal.assertThat().loginModalIsDisplayed();
	}
}
