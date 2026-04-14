import { BasePage } from "@base/base-page";
import { step } from "decorators/step";
import { SETTINGS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { expect, Locator, Page } from "@playwright/test";
import { SettingsPageAsserter } from "./settings-page-asserter";
import { SettingsPageMap } from "./settings-page-map";
import { SettingsPageSteps } from "./settings-page-steps";
import { Toast } from "@pages/components/toast/toast";

export class SettingsPage extends BasePage<SettingsPageMap> {
	public toast: Toast;

	public constructor(page: Page) {
		super(page, new SettingsPageMap(page));
		this.toast = new Toast(page);
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
	private async fill2FACodeInputs(
		inputs: Locator,
		code2FA: string,
	): Promise<void> {
		const inputCount = await inputs.count();
		expect(inputCount).toBe(code2FA.length);

		for (let i = 0; i < inputCount; i++) {
			const inputElement = inputs.nth(i);
			await inputElement.click();
			await inputElement.fill(code2FA[i]);
		}
	}

	@step("Click Receive News and Offers toggle")
	public async clickReceiveNewsAndOffersToggle(): Promise<void> {
		await this.map.receiveNewsAndOffersToggleLabel.click();
	}

	@step("Click confirm button")
	private async clickConfirmButton(button: Locator): Promise<void> {
		await button.click();
	}

	@step("Fill 2FA activation code inputs")
	public async fill2FAActivationCodeInputs(code2FA: string): Promise<void> {
		await this.fill2FACodeInputs(
			this.map.fields2FACodeInputsActivationModal,
			code2FA,
		);
	}

	@step("Click confirm activation button")
	public async clickConfirmActivationButton(): Promise<void> {
		await this.clickConfirmButton(this.map.confirm2FAActivationCodeButton);
	}

	@step("Fill 2FA deactivation code inputs")
	public async fill2FADeactivationCodeInputs(code2FA: string): Promise<void> {
		await this.fill2FACodeInputs(
			this.map.fields2FACodeInputsDeactivationModal,
			code2FA,
		);
	}

	@step("Click confirm deactivation button")
	public async clickConfirmDeactivation2FAButton(): Promise<void> {
		await this.clickConfirmButton(
			this.map.confirm2FADeactivationCodeButton,
		);
	}
}
