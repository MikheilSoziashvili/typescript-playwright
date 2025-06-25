import { BaseAsserter } from "@base/base-asserter";
import { TwoFactorAuthModal } from "./two-factor-auth-modal";
import { step } from "decorators/step";

export class TwoFactorAuthModalAsserter extends BaseAsserter<TwoFactorAuthModal> {
	public constructor(page: TwoFactorAuthModal) {
		super(page);
	}

	@step("Modal2fa displayed")
	public async modal2FaDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.popup2FaContainer,
		]);
	}

	@step("Modal2fa not displayed")
	public async modal2FaNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.popup2FaContainer,
		]);
	}
}
