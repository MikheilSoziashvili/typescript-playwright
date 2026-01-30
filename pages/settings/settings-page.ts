import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
import { SETTINGS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { expect, Page } from "@playwright/test";
import { SettingsPageAsserter } from "./settings-page-asserter";
import { SettingsPageMap } from "./settings-page-map";
import { SettingsPageSteps } from "./settings-page-steps";

export class SettingsPage extends BasePage<SettingsPageMap> {
	public constructor(page: Page) {
		super(page, new SettingsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SETTINGS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): SettingsPageAsserter {
		return new SettingsPageAsserter(this);
	}

	public steps(): SettingsPageSteps {
		return new SettingsPageSteps(this);
	}

	@step("Open 2FA activation modal")
	public async open2FAActivationModal(): Promise<void> {
		await this.map.enable2FAButton.click();
	}

	@step("Open 2FA disable modal")
	public async open2FADisableModal(): Promise<void> {
		await this.map.disable2FAButton.click();
	}

	@step("Take QR code image screenshot")
	public async takeQRCodeImageScreenshot(
		screenshotPath: string,
	): Promise<void> {
		await this.map.imageQRCode.screenshot({ path: screenshotPath });
	}

	@step("Fill 2FA code inputs")
	public async fill2FACodeInputs(code2FA: string): Promise<void> {
		const inputCount =
			await this.map.fields2FACodeInputsActivationModal.count();
		expect(inputCount).toBe(code2FA.length);
		for (let i = 0; i < inputCount; i++) {
			const inputElement =
				this.map.fields2FACodeInputsActivationModal.nth(i);
			await inputElement.click();
			await inputElement.fill(code2FA[i]);
		}
	}

	@step("Click confirm button")
	public async clickConfirmButton(): Promise<void> {
		await this.map.confirm2FAActivationCodeButton.click();
	}
}
