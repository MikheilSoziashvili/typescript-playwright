import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { RegisterModal } from "./register-modal";

export class RegisterModalAsserter extends BaseAsserter<RegisterModal> {
	public constructor(page: RegisterModal) {
		super(page);
	}

	@step("Check register modal elements are visible")
	async registerModalElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.startPlayingBtn,
				this.gamdomPage.map.usernameField,
				this.gamdomPage.map.passwordField,
				this.gamdomPage.map.emailField,
				this.gamdomPage.map.termsOfServiceCheckbox,
			],
			Timeout.MAX,
		);
	}

	@step("Verify register form is displayed")
	public async registerFormIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.registerDialog,
			this.gamdomPage.map.registerForm,
		]);
	}

	@step("Verify register form elements are visible")
	public async registerFormElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.usernameContainer,
			this.gamdomPage.map.passwordContainer,
			this.gamdomPage.map.emailContainer,
			this.gamdomPage.map.termsOfServiceCheckbox,
			this.gamdomPage.map.startPlayingBtn,
		]);
	}

	@step("Verify register form with register elements are displayed")
	public async registerFormWithRegisterElementsAreDisplayed(): Promise<void> {
		await this.registerFormIsDisplayed();
		await this.registerFormElementsAreVisible();
	}
}
