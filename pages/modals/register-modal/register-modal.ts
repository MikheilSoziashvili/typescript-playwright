import { Locator, Page, expect } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { RegisterModalMap } from "./register-modal-map";
import { RegisterTestData } from "@dtos/test-data";
import { Delay } from "@enums/delay";
import { step } from "decorators/step";
import { RegisterModalAsserter } from "./register-modal-asserter";
import { RegisterModalSteps } from "./register-modal-steps";

export class RegisterModal extends BaseModal<RegisterModalMap> {
	constructor(page: Page) {
		super(page, new RegisterModalMap(page));
	}

	public assertThat(): RegisterModalAsserter {
		return new RegisterModalAsserter(this);
	}

	public steps(): RegisterModalSteps {
		return new RegisterModalSteps(this);
	}

	@step("Wait until checked")
	private async waitUntilChecked(locator: Locator): Promise<void> {
		await expect(locator).toHaveClass(/.*checked.*/);
	}

	@step("Fill in credentials")
	public async fillInCredentials(
		registerData: RegisterTestData,
		options: {
			acceptTermsOfService?: boolean;
		} = {},
	): Promise<void> {
		const { acceptTermsOfService = true } = options;

		await this.map.usernameField.fill(registerData.username);
		await this.map.passwordField.fill(registerData.password);
		await this.map.emailField.fill(registerData.email);

		if (acceptTermsOfService) {
			const termsOfServiceCheckbox = this.map.termsOfServiceCheckbox;

			await termsOfServiceCheckbox.click({
				delay: Delay.EXTRA_SHORT,
			});

			await this.waitUntilChecked(termsOfServiceCheckbox);
		}
	}

	@step("Click start playing button")
	public async clickStartPlayingBtn(): Promise<void> {
		await this.map.startPlayingBtn.focus();
		await this.map.startPlayingBtn.click({ delay: Delay.SHORT });
	}

	@step("Click start playing button - v4")
	public async clickStartPlayingBtnV4(): Promise<void> {
		await this.map.startPlayingBtnV4.focus();
		await this.map.startPlayingBtnV4.click({ delay: Delay.SHORT });
	}
}
