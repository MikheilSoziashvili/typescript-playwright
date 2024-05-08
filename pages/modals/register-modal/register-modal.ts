import { Page } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { RegisterModalMap } from "./register-modal-map";
import { RegisterTestData } from "@dtos/test-data";
import { Delay } from "@enums/delay";

export class RegisterModal extends BaseModal<RegisterModalMap> {
	constructor(page: Page) {
		super(page, new RegisterModalMap(page));
	}

	public assertThat(): void {
		throw new Error("Method not implemented.");
	}

	public async fillInCredentials(
		registerData: RegisterTestData,
		options: {
			acceptTermsOfService?: boolean;
			acceptNewsOffers?: boolean;
		} = {},
	): Promise<void> {
		const { acceptTermsOfService = true, acceptNewsOffers = false } =
			options;

		await this.map.usernameField.fill(registerData.username);
		await this.map.passwordField.fill(registerData.password);
		await this.map.emailField.fill(registerData.email);

		if (acceptTermsOfService)
			await this.map.termsOfServiceCheckbox.click({
				delay: Delay.EXTRA_SHORT,
			});
		if (acceptNewsOffers)
			await this.map.newsAndOffersCheckbox.click({
				delay: Delay.EXTRA_SHORT,
			});
	}

	public async clickStartPlayingBtn(): Promise<void> {
		await this.map.startPlayingBtn.focus();
		await this.map.startPlayingBtn.click({ delay: Delay.SHORT });
	}
}
