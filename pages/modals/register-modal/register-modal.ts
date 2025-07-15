import { Locator, Page, expect } from "@playwright/test";
import { BaseModal } from "@base/base-modal";
import { RegisterModalMap } from "./register-modal-map";
import { RegisterTestData } from "@dtos/test-data";
import { Delay } from "@enums/delay";
import { step } from "decorators/step";
import { RegisterModalAsserter } from "./register-modal-asserter";

export class RegisterModal extends BaseModal<RegisterModalMap> {
	constructor(page: Page) {
		super(page, new RegisterModalMap(page));
	}

	public assertThat(): RegisterModalAsserter {
		return new RegisterModalAsserter(this);
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
			acceptNewsOffers?: boolean;
		} = {},
	): Promise<void> {
		const { acceptTermsOfService = true, acceptNewsOffers = false } =
			options;

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
		if (acceptNewsOffers) {
			const newsAndOffersCheckbox = this.map.newsAndOffersCheckbox;

			await newsAndOffersCheckbox.click({
				delay: Delay.EXTRA_SHORT,
			});

			await this.waitUntilChecked(newsAndOffersCheckbox);
		}
	}

	@step("Click start playing button")
	public async clickStartPlayingBtn(): Promise<void> {
		await this.map.startPlayingBtn.focus();
		await this.map.startPlayingBtn.click({ delay: Delay.SHORT });
	}
}
