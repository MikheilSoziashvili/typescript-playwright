import { BaseModalStep } from "@pages/base/base-modal-step";
import { LoginModal } from "./login-modal";
import { step } from "decorators/step";

export class LoginModalSteps extends BaseModalStep<LoginModal> {
	public constructor(gamdomModal: LoginModal) {
		super(gamdomModal);
	}

	@step("Send forgot password email successfully - v4")
	public async sendForgotPasswordEmailSuccessfullyV4(
		email: string,
		expectedText: string,
	): Promise<void> {
		await this.gamdomModal.clickForgotPasswordButtonV4();
		await this.gamdomModal.fillInEmailForForgotPasswordV4(email);
		await this.gamdomModal.clickSendButtonForForgotPasswordV4();
		await this.gamdomModal
			.assertThat()
			.forgotPasswordConfirmationTextAndVisibilityV4(expectedText);
	}

	@step("Close forgot password form - v4")
	public async closeForgotPasswordFormAndVerifyV4(): Promise<void> {
		await this.gamdomModal.closeForgotPasswordFormV4();
		await this.gamdomModal.assertThat().forgotPasswordFormIsNotVisibleV4();
		await this.gamdomModal.assertThat().loginModalIsDisplayedV4();
	}
}
