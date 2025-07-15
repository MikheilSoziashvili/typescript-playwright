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
}
