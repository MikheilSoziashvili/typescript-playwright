import { RegisterTestData } from "@dtos/test-data";
import { BaseModalStep } from "@pages/base/base-modal-step";
import { step } from "decorators/step";
import { RegisterModal } from "./register-modal";

export class RegisterModalSteps extends BaseModalStep<RegisterModal> {
	public constructor(modal: RegisterModal) {
		super(modal);
	}

	@step("Fill in credentials successfully")
	public async fillInCredentialsSuccessfully(
		registerData: RegisterTestData,
		options: {
			acceptTermsOfService?: boolean;
			acceptNewsOffers?: boolean;
		} = {},
	): Promise<void> {
		const { acceptTermsOfService = true, acceptNewsOffers = false } =
			options;

		await this.gamdomModal.map.usernameField.fill(registerData.username);
		await this.gamdomModal.map.passwordField.fill(registerData.password);
		await this.gamdomModal.map.emailField.fill(registerData.email);

		if (acceptTermsOfService) {
			await this.gamdomModal
				.steps()
				.checkCheckbox(
					this.gamdomModal.map.termsOfServiceCheckboxVisual,
					this.gamdomModal.map.termsOfServiceCheckboxInput,
					true,
				);
		}

		if (acceptNewsOffers) {
			await this.gamdomModal
				.steps()
				.checkCheckbox(
					this.gamdomModal.map.newsAndOffersCheckboxVisual,
					this.gamdomModal.map.newsAndOffersCheckboxInput,
					true,
				);
		}
	}
}
