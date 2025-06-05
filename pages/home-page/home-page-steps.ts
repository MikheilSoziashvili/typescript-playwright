import { BasePageStep } from "@pages/base/base-page-step";
import { RegisterTestData } from "@dtos/test-data";
import { HomePage } from "./home-page";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { RegisterTestDataParams } from "@core/interfaces";
import { Locator, Page } from "playwright";
import { generate2FACodeFromQRCodeImage, waitUntil } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { VisibilityResult } from "@core/types/types";
import { GameProvider } from "@enums/game-providers";
import { step } from "decorators/step";
import { MailinatorApi } from "@api/mailinator-api";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class HomePageSteps extends BasePageStep<HomePage> {
	public constructor(gamdomPage: HomePage) {
		super(gamdomPage);
	}

	@step()
	public async loginUsername(username: string): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openLoginModal();

		await this.gamdomPage.loginModal.loginAsUser(username);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}

	@step()
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

	@step()
	public async generateAndLoginUserWith2FaCodeSuccessfully(
		username: string,
		password: string,
		qrCode2FAImagePath: string,
	): Promise<void> {
		const code2FA = await generate2FACodeFromQRCodeImage(
			qrCode2FAImagePath,
		);
		await this.loginUserWith2FaCodeSuccessfully(
			username,
			password,
			code2FA,
		);
	}

	@step()
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

	@step()
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

	@step()
	public async goToCarouselSlide(
		slideName: HomePageBannerCarouselSlideTitle,
	): Promise<void> {
		await this.gamdomPage.waitCarouselSlideToBeActive(slideName);
		await this.gamdomPage.clickCarouselSlide(slideName);
	}

	@step()
	public async findProviderInCasinoHover(
		providerName: string,
	): Promise<Locator> {
		const nextButton = this.gamdomPage.map.nextPageButton;

		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await this.gamdomPage.map.casinoMenuLocator.hover();

				let providerLocator =
					this.gamdomPage.map.providerInCasinoMenu(providerName);

				while (
					(await providerLocator.count()) === 0 &&
					(await nextButton.isEnabled())
				) {
					await this.gamdomPage.map.waitForVisibility({
						locator: nextButton,
						timeout: Timeout.MEDIUM,
					});
					await nextButton.click();
					providerLocator =
						this.gamdomPage.map.providerInCasinoMenu(providerName);
				}

				return (await providerLocator.count()) > 0;
			},
			{
				errorMessage: `Provider '${providerName}' not found in casino menu after full pagination + retries`,
				timeoutSeconds: TimeoutSeconds.NINETY,
			},
		);

		return this.gamdomPage.map.providerInCasinoMenu(providerName);
	}

	@step()
	public async verifyProviderVisibility(provider: string): Promise<void> {
		await this.gamdomPage.map.casinoMenuLocator.hover();

		await this.findProviderInCasinoHover(provider);

		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.providerInCasinoMenu(provider),
			]);
	}

	@step()
	public async verifyProviderInvisibility(provider: string): Promise<void> {
		await this.gamdomPage.map.casinoMenuLocator.hover();

		const maxAttempts = 5;
		const nextButton = this.gamdomPage.map.nextPageButton;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const providerLocator =
				this.gamdomPage.map.providerInCasinoMenu(provider);
			if ((await providerLocator.count()) > 0) {
				throw new Error(
					`Provider '${provider}' should not be visible, but was found.`,
				);
			}
			if (!(await nextButton.isEnabled())) {
				break;
			}
			await nextButton.click();
		}
	}

	@step(
		`Navigating to home page and checking provider visibility based on configuration`,
	)
	public async verifyProviderOptionStateInBelt(
		homePage: HomePage,
		providerName: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await homePage.navigateAndCheckTitle();

		await waitUntil(
			async () => {
				await homePage.refresh();
				try {
					await homePage
						.assertThat()
						.verifyProviderOptionStateInBelt(
							providerName,
							expectedResult,
						);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${providerName} was not ${expectedResult} in the belt on the home page in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}

	public async resetPassword(email: string): Promise<void> {
		await this.gamdomPage.loginModal.clickResetPasswordButton();
		await this.gamdomPage.loginModal.fillInEmail(email);
		await this.gamdomPage.loginModal.clickSendNewPasswordButton();
		await this.gamdomPage.loginModal
			.assertThat()
			.assertPasswordResetEmailIsSent();
	}

	@step()
	public async changePasswordFromEmail(
		newPassword: string,
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		subjectIncludes?: string,
		timeout = Timeout.LONG,
		interval = Timeout.EXTRA_SHORT,
	): Promise<void> {
		const message = await mailinatorApi.pollForMessages(
			domain,
			inbox,
			timeout,
			interval,
			messageIndex,
			subjectIncludes,
		);
		const resetPasswordEmailId = message.id;

		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			resetPasswordEmailId,
		);
		const changePasswordLink = emailLinks.links[0];

		await page.goto(changePasswordLink);
		await this.gamdomPage.loginModal.setNewPassword(newPassword);
	}
}
