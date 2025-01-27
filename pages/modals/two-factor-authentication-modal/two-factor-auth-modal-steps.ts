import { BasePageStep } from "@pages/base/base-page-step";
import { TwoFactorAuthModal } from "./two-factor-auth-modal";

export class TwoFactorAuthModalSteps extends BasePageStep<TwoFactorAuthModal> {
	public constructor(page: TwoFactorAuthModal) {
		super(page);
	}

	public async enter2FaCodeSuccessfully(
		twoFactorAuthenticationCode: string,
	): Promise<void> {
		await this.gamdomPage.assertThat().modal2FaDisplayed();
		await this.gamdomPage.enter2FaCode(twoFactorAuthenticationCode);
		await this.gamdomPage.assertThat().modal2FaNotDisplayed();
	}
}
