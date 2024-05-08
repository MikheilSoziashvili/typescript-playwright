import { BasePageStep } from "@core/helpers/base-page-step";
import { RegisterTestData } from "@dtos/test-data";
import { HomePage } from "./home-page";

export class HomePageSteps extends BasePageStep<HomePage> {
	public constructor(gamdomPage: HomePage) {
		super(gamdomPage);
	}

	public async loginUsername(username: string): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openLoginModal();

		await this.gamdomPage.loginModal.loginAsUser(username);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}

	public async loginUser(
		username: string,
		password: string,
		options?: { expectErrors?: boolean },
	): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openLoginModal();

		await this.gamdomPage.loginModal.login(username, password);
		if (!options?.expectErrors) {
			await this.gamdomPage.assertThat().userIsLoggedIn();
		}
	}

	public async registerNewUser(
		newUserRegisterData: RegisterTestData,
	): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openRegisterModal();

		await this.gamdomPage.registerModal.fillInCredentials(
			newUserRegisterData,
			{
				acceptTermsOfService: true,
				acceptNewsOffers: true,
			},
		);
		await this.gamdomPage.registerModal.clickStartPlayingBtn();
		await this.gamdomPage
			.assertThat()
			.userIsRegistered(newUserRegisterData.username);
	}
}
