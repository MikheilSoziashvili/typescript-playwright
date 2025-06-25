import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { BasePageStep } from "@pages/base/base-page-step";
import { Toast } from "@pages/components/toast/toast";
import { expect } from "@playwright/test";
import { SettingsPage } from "./settings-page";
import { generate2FACodeFromQRCodeImage } from "@core/utils/utils";

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
		await this.gamdomPage.fill2FACodeInputs(code2FA);
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
				this.gamdomPage.map.verification2FAPopup,
			]);
		const code2FA = await generate2FACodeFromQRCodeImage(screenshotPath);
		await this.gamdomPage.fill2FACodeInputs(code2FA);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.verification2FAPopup,
			]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.disable2FaModalLocator,
			]);
		await this.gamdomPage.map.continueDisable2FaButton.dblclick();

		await this.disable2FaWorkaround(screenshotPath);

		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.disable2FaModalLocator,
			]);
	}

	// Workaround step for disabling the 2FA
	// TODO: Remove when the issue is fixed
	@step("Disable 2FA workaround")
	private async disable2FaWorkaround(screenshotPath: string): Promise<void> {
		let attempts = 0;
		while (
			(await this.gamdomPage.map.disable2FaModalLocator.isVisible()) &&
			attempts < 5
		) {
			attempts++;
			await this.gamdomPage.refresh();
			await this.gamdomPage.open2FADisableModal();
			const code2FA2 = await generate2FACodeFromQRCodeImage(
				screenshotPath,
			);
			await this.gamdomPage.fill2FACodeInputs(code2FA2);
			await this.gamdomPage.map.continueDisable2FaButton.dblclick();
			// eslint-disable-next-line playwright/no-wait-for-timeout
			await this.gamdomPage.page.waitForTimeout(1000);
		}
		if (attempts >= 5) {
			throw new Error("Maximum attempts to disable 2FA reached.");
		}
	}
}
