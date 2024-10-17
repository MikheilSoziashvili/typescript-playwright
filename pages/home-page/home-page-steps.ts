import { BasePageStep } from "@pages/base/base-page-step";
import { RegisterTestData } from "@dtos/test-data";
import { HomePage } from "./home-page";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { RegisterTestDataParams } from "@core/interfaces";

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

	public async loginUserWith2FaCodeSuccessfully(
		username: string,
		password: string,
		twoFactorAuthenticationCode: string,
	): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openLoginModal();
		await this.gamdomPage.loginModal.login(username, password);
		await this.gamdomPage.loginModal.enter2FaCode(
			twoFactorAuthenticationCode,
		);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}

	public async registerNewUser(
		params: RegisterTestDataParams = {},
	): Promise<RegisterTestData> {
		await this.gamdomPage.navigateAndCheckTitle();
		await this.gamdomPage.unauthenticatedHeader.openRegisterModal();

		const registeredData = new RegisterTestData(params);
		await this.gamdomPage.registerModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
			acceptNewsOffers: true,
		});
		await this.gamdomPage.registerModal.clickStartPlayingBtn();
		await this.gamdomPage
			.assertThat()
			.userIsRegistered(registeredData.username);

		return registeredData;
	}

	public async goToCarouselSlide(
		slideName: HomePageBannerCarouselSlideTitle,
	): Promise<void> {
		await this.gamdomPage.waitCarouselSlideToBeActive(slideName);
		await this.gamdomPage.clickCarouselSlide(slideName);
	}
}
