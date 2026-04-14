import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { BasePageStep } from "@pages/base/base-page-step";
import { Toast } from "@pages/components/toast/toast";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { expect } from "@playwright/test";
import { UsersColumns } from "@enums/db/users-columns";
import { GamdomDb } from "database/gamdom-db";
import { SettingsPage } from "./settings-page";
import { generate2FACodeFromQRCodeImage } from "@core/utils/utils";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

export class SettingsPageSteps extends BasePageStep<SettingsPage> {
	public constructor(gamdomPage: SettingsPage) {
		super(gamdomPage);
	}

	@step("Toggle Receive News and Offers and verify")
	public async toggleReceiveNewsAndOffersAndVerify(
		checked: boolean,
		gamdomDb: GamdomDb,
		userId: number,
	): Promise<void> {
		const expectedSubTitle = checked
			? ToastSubTitle.SUBSCRIBED_TO_NEWS_AND_OFFERS
			: ToastSubTitle.UNSUBSCRIBED_FROM_NEWS_AND_OFFERS;
		await this.gamdomPage.clickReceiveNewsAndOffersToggle();
		await this.gamdomPage
			.assertThat()
			.receiveNewsAndOffersToggleIsChecked(checked);
		await this.gamdomPage.toast.assertThat().toastMessageIs(ToastTitle.SUCCESS, expectedSubTitle);
		await this.gamdomPage.toast.assertThat().isNotDisplayed({ subTitle: expectedSubTitle });
		const [userRow] = await gamdomDb.getUserInfoById(userId);
		const emailConsent = userRow[UsersColumns.EmailConsent] as boolean;
		await this.gamdomPage.assertThat().emailConsentInDbIs(emailConsent, checked);
	}

	@step("Navigate and enable 2FA authentication")
	public async navigateAndEnable2FaAuthentication(
		screenshotPath: string,
	): Promise<void> {
		await this.gamdomPage.navigate();
		await this.enable2FaAuthentication(screenshotPath);
	}

	@step("Enable 2FA authentication")
	public async enable2FaAuthentication(
		screenshotPath: string,
	): Promise<void> {
		await this.gamdomPage.open2FAActivationModal();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.activation2FAPopup]);
		await this.gamdomPage.takeQRCodeImageScreenshot(screenshotPath);
		const code2FA = await generate2FACodeFromQRCodeImage(screenshotPath);
		await this.gamdomPage.fill2FAActivationCodeInputs(code2FA);
		await this.gamdomPage.clickConfirmActivationButton();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.activation2FAPopup,
			]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.disable2FAButton]);

		const toast = new Toast(this.gamdomPage.page);
		await expect(toast.map.toastTitleLocator()).toBeVisible();
		await expect(toast.map.toastTitleLocator()).toBeHidden({
			timeout: Timeout.LONG,
		});
	}

	@step("Disable 2FA authentication")
	public async disable2FaAuthentication(
		screenshotPath: string,
	): Promise<void> {
		await this.gamdomPage.open2FADisableModal();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.deactivation2FaPopup,
			]);
		await this.gamdomPage.map.confirm2FADeactivationCodeButton.click();
		const code2FA = await generate2FACodeFromQRCodeImage(screenshotPath);
		await this.gamdomPage.fill2FADeactivationCodeInputs(code2FA);
		await this.gamdomPage.map.continue2FADeactivationCodeButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.deactivation2FaPopup,
			]);
	}

	@step("Enable self exclusion")
	public async navigateAndEnableSelfExclusion(
		days: SelfExclusionDays,
	): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().selfExclusionTabsVisible();
		await this.gamdomPage.map.selfExclusionTime(days).click();
		await this.gamdomPage.assertThat().selfExclusionModalHeadingVisible();
		await this.gamdomPage.map.confirmModalContinueButton.click();
		await this.gamdomPage.refresh();
		await this.gamdomPage.assertThat().selfExclusionTabNotVisible();
		await this.gamdomPage.assertThat().selfExclusionTimerDisplayed(days);
	}
}
