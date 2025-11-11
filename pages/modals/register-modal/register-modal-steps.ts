import { RegisterTestData } from "@dtos/test-data";
import { BaseModalStep } from "@pages/base/base-modal-step";
import { step } from "decorators/step";
import { RegisterModal } from "./register-modal";

export class RegisterModalSteps extends BaseModalStep<RegisterModal> {
	public constructor(modal: RegisterModal) {
		super(modal);
	}

	@step("Fill in credentials successfully - v4")
	public async fillInCredentialsSuccessfullyV4(
		registerData: RegisterTestData,
		options: {
			acceptTermsOfService?: boolean;
			acceptNewsOffers?: boolean;
		} = {},
	): Promise<void> {
		const { acceptTermsOfService = true, acceptNewsOffers = false } =
			options;

		await this.gamdomModal.map.usernameFieldV4.fill(registerData.username);
		await this.gamdomModal.map.passwordFieldV4.fill(registerData.password);
		await this.gamdomModal.map.emailFieldV4.fill(registerData.email);

		if (acceptTermsOfService) {
			await this.gamdomModal
				.steps()
				.checkCheckbox(
					this.gamdomModal.map.termsOfServiceCheckboxInputV4,
					this.gamdomModal.map.termsOfServiceCheckboxVisualV4,
					true,
				);
		}

		if (acceptNewsOffers) {
			await this.gamdomModal
				.steps()
				.checkCheckbox(
					this.gamdomModal.map.newsAndOffersCheckboxInputV4,
					this.gamdomModal.map.newsAndOffersCheckboxVisualV4,
					true,
				);
		}
	}
}
