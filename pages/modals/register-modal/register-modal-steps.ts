import { Page } from "@playwright/test";
import { RegisterModal } from "./register-modal";
import { RegisterTestData } from "@dtos/test-data";
import { BaseModalStep } from "@base/base-modal-step";
import { HomePage } from "@pages/home-page/home-page";

export class RegisterModalSteps extends BaseModalStep<RegisterModal> {
	private homePage: HomePage;

	constructor(gamdomModal: RegisterModal, page: Page) {
		super(gamdomModal);
		this.homePage = new HomePage(page);
	}

	public async registerNewUser(email: string): Promise<RegisterTestData> {
		await this.homePage.navigateAndCheckTitle();
		await this.homePage.unauthenticatedHeader.openRegisterModal();

		const registeredData = new RegisterTestData(
			undefined,
			undefined,
			email,
		);
		await this.gamdomModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await this.gamdomModal.clickStartPlayingBtn();

		return registeredData;
	}
}
