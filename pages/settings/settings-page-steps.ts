import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { BasePageStep } from "@pages/base/base-page-step";
import { Toast } from "@pages/components/toast/toast";
import { expect } from "@playwright/test";
import { SettingsPage } from "./settings-page";
import { generate2FACodeFromQRCodeImage } from "@core/utils/utils";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

export class SettingsPageSteps extends BasePageStep<SettingsPage> {
	public constructor(gamdomPage: SettingsPage) {
		super(gamdomPage);
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
