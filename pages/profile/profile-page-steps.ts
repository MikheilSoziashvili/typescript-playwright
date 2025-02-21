import { MailinatorApi } from "@api/mailinator-api";
import { getRandomEmail, getRandomPhone } from "@core/utils/utils";
import { ContactType } from "@enums/personal-info-types";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { BasePageStep } from "@pages/base/base-page-step";
import { Page } from "@playwright/test";
import { ProfilePage } from "./profile-page";

export class ProfilePageSteps extends BasePageStep<ProfilePage> {
	public constructor(gamdomPage: ProfilePage) {
		super(gamdomPage);
	}

	private async setHideUserStatisticsMode(): Promise<void> {
		if (!(await this.gamdomPage.map.hideStatisticsToggle.isChecked())) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already enabled");
		}
	}

	private async setShowUserStatisticsMode(): Promise<void> {
		if (await this.gamdomPage.map.hideStatisticsToggle.isChecked()) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already disabled");
		}
	}

	public async toggleUserStatisticsMode(toggle: "on" | "off"): Promise<void> {
		if (toggle === "on") {
			await this.setHideUserStatisticsMode();
		} else {
			await this.setShowUserStatisticsMode();
		}
	}

	public async completeVerificationFlow(): Promise<void> {
		await this.gamdomPage.map.verifyButton.click();
		await this.gamdomPage.map.continueVerificationButton.click();
	}

	public async verifyEmail(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = Timeout.LONG,
		interval = Timeout.EXTRA_SHORT,
	): Promise<void> {
		// Poll for the verification email
		const message = await mailinatorApi.pollForMessages(
			domain,
			inbox,
			timeout,
			interval,
			messageIndex,
		);
		const verificationEmailId = message.id;

		// Fetch the email links and navigate to the new verification link
		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			verificationEmailId,
		);
		const verificationLink = emailLinks.links[0];

		await page.goto(verificationLink);
	}

	public async verifyEmailAndCheckProfile(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = Timeout.LONG,
		interval = Timeout.EXTRA_SHORT,
	): Promise<void> {
		await this.verifyEmail(
			mailinatorApi,
			domain,
			inbox,
			page,
			{ messageIndex },
			timeout,
			interval,
		);

		// Assert account is already verified
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().assertVerifyButtonNotVisible();
	}

	public async changeEmailSuccessfully(email: string): Promise<void> {
		await this.changeEmail(email);
		await this.completeAndVerifyEmailChange();
	}

	public async changeEmail(email: string): Promise<void> {
		await this.gamdomPage.map.changeEmailButton.click();
		await this.gamdomPage.map.changeEmailInput.fill(email);
		await this.gamdomPage.clickSaveEmail();
	}

	public async completeAndVerifyEmailChange(): Promise<void> {
		await this.gamdomPage.continueModal.assertThat().isDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
		await this.gamdomPage.assertThat().assertChangeEmailButtonVisible();
	}

	public async changePhoneSuccessfully(phone: string): Promise<void> {
		await this.changePhone(phone);
		await this.completeAndVerifyPhoneChange();
	}

	public async changePhone(phone: string): Promise<void> {
		await this.gamdomPage.map.changePhoneButton.click();
		await this.gamdomPage.map.changePhoneInput.fill(phone);
		await this.gamdomPage.clickSavePhone();
	}

	public async completeAndVerifyPhoneChange(): Promise<void> {
		await this.gamdomPage.continueModal.assertThat().isDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
		await this.gamdomPage.assertThat().assertChangePhoneButtonVisible();
	}

	public async logoutUserSuccessfully(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.logout();
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	public async cancelLogout(): Promise<void> {
		await this.gamdomPage.map.logOutButton.click();
		await this.gamdomPage.continueModal
			.assertThat()
			.continueAndCancelButtonsDisplayed();
		await this.gamdomPage.continueModal.clickCancelButton();
	}

	public async updateContactInfoWithUniqueValue(
		type: ContactType,
		isWith2FaFlow: boolean,
		qrCode2FAImagePath = "QR_CODE_2FA_IMAGE_PATH",
	): Promise<void> {
		if (isWith2FaFlow && qrCode2FAImagePath === "QR_CODE_2FA_IMAGE_PATH") {
			throw new Error(
				"qrCode2FAImagePath is required when isWith2FaFlow is true.",
			);
		}

		switch (type) {
			case ContactType.EMAIL:
				await this.changeEmail(getRandomEmail());
				if (isWith2FaFlow) {
					await this.gamdomPage.twoFactorAuthModal
						.steps()
						.generateAndEnter2FaCodeSuccessfully(
							qrCode2FAImagePath,
						);
					await this.gamdomPage.clickSaveEmail();
				} else {
					await this.gamdomPage.twoFactorAuthModal
						.assertThat()
						.modal2FaNotDisplayed();
				}
				await this.gamdomPage.steps().completeAndVerifyEmailChange();
				break;

			case ContactType.PHONE:
				await this.changePhone(getRandomPhone());
				if (isWith2FaFlow) {
					await this.gamdomPage.twoFactorAuthModal
						.steps()
						.generateAndEnter2FaCodeSuccessfully(
							qrCode2FAImagePath,
						);
					await this.gamdomPage
						.assertThat()
						.assertChangePhoneButtonVisible();
				} else {
					await this.gamdomPage.twoFactorAuthModal
						.assertThat()
						.modal2FaNotDisplayed();
					await this.completeAndVerifyPhoneChange();
				}
				break;

			default:
				throw new Error(`Unsupported contact type: ${String(type)}`);
		}
	}
}
