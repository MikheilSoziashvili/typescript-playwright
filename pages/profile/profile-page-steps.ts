import { MailinatorApi } from "@api/mailinator-api";
import { step } from "decorators/step";
import { getRandomEmail, getRandomPhone } from "@core/utils/utils";
import { ContactType } from "@enums/personal-info-types";
import { Timeout } from "@enums/timeout";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, Page } from "@playwright/test";
import { ProfilePage } from "./profile-page";
import { UserPrivacyOption } from "@enums/user-privacy-options";
import { ToggleOptions } from "@enums/visibility-options";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { Toast } from "@pages/components/toast/toast";

export class ProfilePageSteps extends BasePageStep<ProfilePage> {
	public toast: Toast;
	public constructor(gamdomPage: ProfilePage) {
		super(gamdomPage);
		this.toast = new Toast(gamdomPage.page);
	}

	@step("Toggle user privacy setting: {setting} -> {mode}")
	public async toggleUserPrivacy(
		setting: UserPrivacyOption,
		mode: ToggleOptions,
	): Promise<void> {
		const toggles = {
			[UserPrivacyOption.STATISTICS]:
				this.gamdomPage.map.hideStatisticsToggle,
			[UserPrivacyOption.DETAILS]: this.gamdomPage.map.hideDetailsToggle,
		} as const;

		const toggle = toggles[setting];

		const shouldBeChecked = mode === ToggleOptions.ON;
		const isChecked = await toggle.isChecked();

		if (isChecked === shouldBeChecked) {
			return;
		}

		await toggle.click();
	}

	@step("Enable Hidden Details privacy and verify toast message")
	public async enableHiddenDetails(): Promise<void> {
		await this.toggleUserPrivacy(
			UserPrivacyOption.DETAILS,
			ToggleOptions.ON,
		);

		await this.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.HIDEN_DETAILS_ENABLED,
			);
	}

	@step("Complete verification flow")
	public async completeVerificationFlow(): Promise<void> {
		await this.gamdomPage.map.verifyButton.click();
		await this.gamdomPage.map.continueVerificationButton.click();
	}

	@step("Verify email")
	public async verifyEmail(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = Timeout.MEDIUM,
		interval = Timeout.SHORT,
	): Promise<void> {
		const message = await mailinatorApi.pollForMessages(
			domain,
			inbox,
			timeout,
			interval,
			messageIndex,
		);
		const verificationEmailId = message.id;

		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			verificationEmailId,
		);
		const verificationLink = emailLinks.links[0];

		await page.goto(verificationLink);
	}

	@step("Verify email and check profile")
	public async verifyEmailAndCheckProfile(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		timeout = Timeout.MEDIUM,
		interval = Timeout.SHORT,
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

		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().assertVerifyButtonNotVisible();
	}

	@step("Verify email and proceed with change password")
	public async verifyEmailAndProceedWithChangePassword(
		mailinatorApi: MailinatorApi,
		domain: string,
		inbox: string,
		page: Page,
		{ messageIndex = 1 }: { messageIndex?: number } = {},
		subjectIncludes?: string,
		timeout = Timeout.MEDIUM,
		interval = Timeout.SHORT,
	): Promise<void> {
		const message = await mailinatorApi.pollForMessages(
			domain,
			inbox,
			timeout,
			interval,
			messageIndex,
			subjectIncludes,
		);
		const changePasswordEmailId = message.id;

		const emailLinks = await mailinatorApi.getEmailLinks(
			domain,
			inbox,
			changePasswordEmailId,
		);
		const changePasswordLink = emailLinks.links[0];

		await page.goto(changePasswordLink);
	}

	@step("Change email successfully")
	public async changeEmailSuccessfully(email: string): Promise<void> {
		await this.changeEmail(email);
		await this.completeAndVerifyEmailChange();
	}

	@step("Change email")
	public async changeEmail(email: string): Promise<void> {
		await this.gamdomPage.map.changeEmailButton.click();
		await this.gamdomPage.map.changeEmailInput.fill(email);
		await this.gamdomPage.clickSaveEmail();
	}

	@step("Complete and verify email change")
	public async completeAndVerifyEmailChange(): Promise<void> {
		await this.gamdomPage.continueModal.assertThat().isModalDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
		await this.gamdomPage.assertThat().assertChangeEmailButtonVisible();
	}

	@step("Change phone successfully")
	public async changePhoneSuccessfully(phone: string): Promise<void> {
		await this.changePhone(phone);
		await this.completeAndVerifyPhoneChange();
	}

	@step("Change phone")
	public async changePhone(phone: string): Promise<void> {
		await this.gamdomPage.map.changePhoneButton.click();
		await this.gamdomPage.map.changePhoneInput.fill(phone);
		await this.gamdomPage.clickSavePhone();
	}

	@step("Change username")
	public async changeUsername(username: string): Promise<void> {
		await this.gamdomPage.map.changeUsernameButton.click();
		await this.gamdomPage.map.changeUsernameInput.fill(username);
		await this.gamdomPage.clickSaveUsername();
		await this.gamdomPage.continueModal.assertThat().isModalDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
	}

	@step("Complete and verify phone change")
	public async completeAndVerifyPhoneChange(): Promise<void> {
		await this.gamdomPage.continueModal.assertThat().isModalDisplayed();
		await this.gamdomPage.continueModal.clickContinueButton();
		await this.gamdomPage.assertThat().assertChangePhoneButtonVisible();
	}

	@step("Logout user successfully")
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
						.assertChangePhoneButtonVisible();
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

	@step("Change username - v4")
	public async changeUsernameV4(username: string): Promise<void> {
		await this.gamdomPage.map.changeUsernameInputV4.fill(username);
		await this.gamdomPage.clickSaveUsernameV4();
		await expect(this.gamdomPage.map.changeUsernameInputV4).toHaveValue(
			username,
		);
	}

	@step("Logout - v4")
	public async logoutV4(): Promise<void> {
		await this.gamdomPage.map.logOutButtonV4.click();
		await this.gamdomPage.continueModal.assertThat().isModalDisplayedV4();
		await this.gamdomPage.continueModal.clickLogoutButtonV4();
	}

	@step("Logout user successfully - v4")
	public async logoutUserSuccessfullyV4(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.logoutV4();
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.loggedInUserElementsAreNotVisibleV4();
		await this.gamdomPage.unauthenticatedHeader
			.assertThat()
			.loggedOutUserElementsAreVisibleV4();
	}
}
