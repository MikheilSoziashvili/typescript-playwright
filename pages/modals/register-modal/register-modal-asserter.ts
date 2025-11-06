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

	@step("Verify register form is displayed - v4")
	public async registerFormIsDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.registerDialogV4,
			this.gamdomPage.map.registerFormV4,
		]);
	}

	@step("Verify register form elements are visible - v4")
	public async registerFormElementsAreVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.usernameContainerV4,
			this.gamdomPage.map.passwordContainerV4,
			this.gamdomPage.map.emailContainerV4,
			this.gamdomPage.map.termsOfServiceCheckboxV4,
			this.gamdomPage.map.newsAndOffersCheckboxV4,
			this.gamdomPage.map.startPlayingBtnV4,
		]);
	}

	@step("Verify register form with register elements are displayed - v4")
	public async registerFormWithRegisterElementsAreDisplayedV4(): Promise<void> {
		await this.registerFormIsDisplayedV4();
		await this.registerFormElementsAreVisibleV4();
	}
}
