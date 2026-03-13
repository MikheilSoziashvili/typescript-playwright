import { MailpitApi } from "@api/mailpit-api";
import { RegisterTestDataParams } from "@core/interfaces";
import { generate2FACodeFromQRCodeImage, waitUntil } from "@core/utils/utils";
import { RegisterTestData } from "@dtos/test-data";
import { HomePageBannerCarouselSlideTitle } from "@enums/homepage-banner-carousel-slide-title";
import { LaunchLocation } from "@enums/homepage-launch-locations";
import { Timeout } from "@enums/timeout";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { ToastTitle } from "@enums/toast-titles";
import { logger } from "@logger/logger";
import { BasePageStep } from "@pages/base/base-page-step";
import { Toast } from "@pages/components/toast/toast";
import { step } from "decorators/step";
import { Page } from "playwright";
import { RegisterTestDataObjectFactory } from "test-data/objects/factories/register-test-data-object-factory";
import { HomePage } from "./home-page";

export class HomePageSteps extends BasePageStep<HomePage> {
	public toast: Toast;
	public constructor(gamdomPage: HomePage) {
		super(gamdomPage);
		this.toast = new Toast(gamdomPage.page);
	}

	@step("Login username")
	public async loginUsername(username: string): Promise<void> {
		await this.gamdomPage.unauthenticatedHeader.openLoginModal();

		await this.gamdomPage.loginModal.loginAsUser(username);
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}

	@step("Login user")
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

	@step("Generate and login user with2fa code successfully")
	public async generateAndLoginUserWith2FaCodeSuccessfully(
		username: string,
		password: string,
		qrCode2FAImagePath: string,
	): Promise<void> {
		const code2FA =
			await generate2FACodeFromQRCodeImage(qrCode2FAImagePath);
		await this.loginUserWith2FaCodeSuccessfully(
			username,
			password,
			code2FA,
		);
	}

	@step("Login user with2fa code successfully")
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
		await this.gamdomPage.loginModal.map.confirm2FAActivationCodeButton.click();
		await this.gamdomPage.assertThat().userIsLoggedIn();
	}

	@step("Register new user")
	public async registerNewUser(
		params: RegisterTestDataParams = {},
	): Promise<RegisterTestData> {
		await this.gamdomPage.navigateAndCheckTitle();
		await this.gamdomPage.unauthenticatedHeader.openRegisterModal();

		const registeredData = RegisterTestDataObjectFactory.build(params);
		await this.gamdomPage.registerModal.fillInCredentials(registeredData, {
			acceptTermsOfService: true,
		});
		await Promise.all([
			this.gamdomPage.steps().verifyToastMessage(ToastTitle.SUCCESS),
			this.gamdomPage.registerModal.clickStartPlayingBtn(),
		]);
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.userIsRegistered(registeredData.username);

		return registeredData;
	}

	@step("Go to carousel slide")
	public async goToCarouselSlide(
		slideName: HomePageBannerCarouselSlideTitle,
		srcPartial: string,
	): Promise<void> {
		await this.gamdomPage.waitCarouselSlideToBeActive(
			slideName,
			srcPartial,
		);
		await this.gamdomPage.clickCarouselSlide(slideName, srcPartial);
	}

	@step("Reset password")
	public async resetPassword(email: string): Promise<void> {
		await this.gamdomPage.loginModal.clickForgotPasswordLink();
		await this.gamdomPage.loginModal.fillInEmail(email);
		await this.gamdomPage.loginModal.clickSendButtonForForgotPassword();
		await this.gamdomPage.loginModal
			.assertThat()
			.assertPasswordResetEmailIsSent();
	}

	@step("Change password from email")
	public async changePasswordFromEmail(
		newPassword: string,
		mailpitApi: MailpitApi,
		email: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		subjectIncludes?: string,
		timeout = TimeoutSeconds.TEN,
		interval = TimeoutSeconds.FIVE,
	): Promise<void> {
		const message = await mailpitApi.pollForMessages(
			email,
			timeout,
			interval,
			messageIndex,
			subjectIncludes,
		);

		const links = await mailpitApi.getMessageLinks(message.ID);
		const changePasswordLink = links[0];

		await page.goto(changePasswordLink);
		await this.gamdomPage.loginModal.setNewPassword(newPassword);
	}

	@step("Verify toast message")
	public async verifyToastMessage(
		title: string,
		timeout: number = Timeout.LONG,
	): Promise<void> {
		await this.toast.assertThat().isDisplayed({ timeout });
		await this.toast.assertThat().titleIs(title, { timeout });
	}

	@step("Click on Originals game launch tile")
	public async clickOnOriginalsGameLaunchTile(
		game: string,
		location: LaunchLocation,
	): Promise<void> {
		if (location === LaunchLocation.SubNav) {
			await this.gamdomPage.map.originalsNavButton.hover();
		}

		const gameTileLocator =
			location === LaunchLocation.SubNav
				? this.gamdomPage.map.originalsGameFromSubNav(game)
				: this.gamdomPage.map.originalsGameFromSection(game);

		const nextButton =
			location === LaunchLocation.SubNav
				? this.gamdomPage.map.originalsSubNavNextButton
				: this.gamdomPage.map.originalsSliderNextButton;

		await waitUntil(
			async () => {
				try {
					const box = await gameTileLocator.boundingBox();
					const isVisible = await gameTileLocator.isVisible();

					if (box && isVisible) {
						await gameTileLocator.click({
							timeout: Timeout.MEDIUM,
						});
						return true;
					}
				} catch (error) {
					logger.debug(
						`[${location}] Game '${game}' not clickable yet. Retrying...`,
						error,
					);
				}

				await nextButton.click();
				return false;
			},
			{
				errorMessage: `Game '${game}' not found in ${location} after full scroll attempts`,
				timeoutSeconds: TimeoutSeconds.THIRTY,
			},
		);
	}

	@step("Get all KOTH header currency amounts")
	public async getAllKothHeaderCurrencyAmounts(): Promise<string[]> {
		const amounts = (
			await this.gamdomPage.map.allKothHeaderCurrencyAmounts.allTextContents()
		)
			.map((e) => e.trim())
			.filter(Boolean);

		logger.info(`Found ${amounts.length} badge amount(s):`, amounts);

		return amounts;
	}

	@step("Navigate to homepage and expand chat if not visible")
	public async navigateAndExpandChat(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.authenticatedHeader.expandChatIfNotVisible();
	}
}
