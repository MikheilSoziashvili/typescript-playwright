import { MailpitApi } from "@api/mailpit-api";
import { step } from "decorators/step";
import { getRandomEmail, getRandomPhone } from "@core/utils/utils";
import { ContactType } from "@enums/personal-info-types";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, Page } from "@playwright/test";
import { ProfilePage } from "./profile-page";
import { Toast } from "@pages/components/toast/toast";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";

export class ProfilePageSteps extends BasePageStep<ProfilePage> {
	public toast: Toast;
	public constructor(gamdomPage: ProfilePage) {
		super(gamdomPage);
		this.toast = new Toast(gamdomPage.page);
	}

	@step("Complete verification flow")
	public async completeVerificationFlow(): Promise<void> {
		await this.gamdomPage.map.verifyButton.click();
	}

	@step("Verify email")
	public async verifyEmail(
		mailpitApi: MailpitApi,
		email: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = TimeoutSeconds.TEN,
		interval = TimeoutSeconds.FIVE,
	): Promise<void> {
		const message = await mailpitApi.pollForMessages(
			email,
			timeout,
			interval,
			messageIndex,
		);

		const links = await mailpitApi.getMessageLinks(message.ID);
		const verificationLink = links[0];

		await page.goto(verificationLink);
	}

	@step("Verify email and check profile")
	public async verifyEmailAndCheckProfile(
		mailpitApi: MailpitApi,
		email: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = TimeoutSeconds.TEN,
		interval = TimeoutSeconds.FIVE,
	): Promise<void> {
		await this.verifyEmail(
			mailpitApi,
			email,
			page,
			{ messageIndex: messageIndex },
			timeout,
			interval,
		);

		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().assertVerifyButtonNotVisible();
	}

	@step("Verify email and proceed with change password")
	public async verifyEmailAndProceedWithChangePassword(
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
	}

	@step("Change email successfully")
	public async changeEmailSuccessfully(email: string): Promise<void> {
		await this.changeEmail(email);
		await this.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.EMAIL_UPDATED_SUCCESSFULLY,
			);
	}

	@step("Change email")
	public async changeEmail(email: string): Promise<void> {
		await this.gamdomPage.map.changeEmailInput.fill(email);
		await this.gamdomPage.clickSaveEmail();
	}

	@step("Change phone successfully")
	public async changePhoneSuccessfully(phone: string): Promise<void> {
		await this.changePhone(phone);
		await this.completeAndVerifyPhoneChange();
	}

	@step("Change phone")
	public async changePhone(phone: string): Promise<void> {
		await this.gamdomPage.map.changePhoneInput.fill(phone);
		await this.gamdomPage.clickSavePhone();
	}

	@step("Complete and verify phone change")
	public async completeAndVerifyPhoneChange(): Promise<void> {
		await this.gamdomPage.continueModal.assertThat().isModalDisplayed();
		await this.gamdomPage.continueModal.clickLogoutButton();
		await this.gamdomPage.assertThat().assertPhoneInputVisible();
	}

	@step("Logout user successfully")
	public async logoutUserSuccessfully(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.logout();
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisible();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisible();
	}

	@step("Cancel logout")
	public async cancelLogout(): Promise<void> {
		await this.gamdomPage.map.logOutButton.click();
		await this.gamdomPage.continueModal
			.assertThat()
			.continueAndCancelButtonsDisplayed();
		await this.gamdomPage.continueModal.clickCancelButton();
	}

	@step("Click change password button successfully")
	public async clickChangePasswordButtonSuccessfully(): Promise<void> {
		await this.gamdomPage.clickChangePasswordButton();
		await this.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.PASSWORD_CHANGE_CONFIRMATION_EMAIL_SENT,
			);
	}

	@step("Update contact info with unique value")
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
						.assertPhoneInputVisible();
				} else {
					await this.gamdomPage.twoFactorAuthModal
						.assertThat()
						.modal2FaNotDisplayed();
				}
				await this.completeAndVerifyPhoneChange();
				break;

			default:
				throw new Error(`Unsupported contact type: ${String(type)}`);
		}
	}

	@step("Change username")
	public async changeUsername(username: string): Promise<void> {
		await this.gamdomPage.map.changeUsernameInput.fill(username);
		await this.gamdomPage.clickSaveUsername();
		await expect(this.gamdomPage.map.changeUsernameInput).toHaveValue(
			username,
		);
	}

	@step("Logout")
	public async logout(): Promise<void> {
		await this.gamdomPage.map.logOutButton.click();
		await this.gamdomPage.continueModal.assertThat().isModalDisplayed();
		await this.gamdomPage.continueModal.clickLogoutButton();
	}
}
