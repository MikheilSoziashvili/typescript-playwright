import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { TwoFactorAuthModal } from "./two-factor-auth-modal";
import { generate2FACodeFromQRCodeImage } from "@core/utils/utils";

export class TwoFactorAuthModalSteps extends BasePageStep<TwoFactorAuthModal> {
	public constructor(page: TwoFactorAuthModal) {
		super(page);
	}

	@step("Enter 2FA code successfully")
	public async enter2FaCodeSuccessfully(
		twoFactorAuthenticationCode: string,
	): Promise<void> {
		await this.gamdomPage.assertThat().modal2FaDisplayed();
		await this.gamdomPage.enter2FaCode(twoFactorAuthenticationCode);
		await this.gamdomPage.map.confirm2FAActivationCodeButton.click();
		await this.gamdomPage.assertThat().modal2FaNotDisplayed();
	}

	@step("Generate and enter 2FA code successfully")
	public async generateAndEnter2FaCodeSuccessfully(
		qrCode2FAImagePath: string,
	): Promise<void> {
		const code2FA =
			await generate2FACodeFromQRCodeImage(qrCode2FAImagePath);
		await this.enter2FaCodeSuccessfully(code2FA);
	}
}
