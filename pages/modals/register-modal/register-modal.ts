import { Page } from "@playwright/test";
import { BaseModal } from "../../base/base-modal";
import { RegisterModalMap } from "./register-modal-map";
import { RegisterTestData } from "../../../dtos/test-data";
import { hardWait } from "../../../core/utils";

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

		if (acceptTermsOfService) await this.map.termsOfServiceCheckbox.click();
		if (acceptNewsOffers) await this.map.newsAndOffersCheckbox.click();
	}

	//Flakiness observed => click event is registered, but nothing happens. Might be env related.
	public async clickStartPlayingBtn(): Promise<void> {
		//TODO: Remove hardwait when fixing the click event issue, this is a workaround to remove flakyness
		await hardWait(3000);
		await this.map.startPlayingBtn.click();
	}
}
