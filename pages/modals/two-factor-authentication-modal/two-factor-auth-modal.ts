import { expect, Page } from "@playwright/test";
import { TwoFactorAuthModalAsserter } from "./two-factor-auth-modal-asserter";
import { TwoFactorAuthModalMap } from "./two-factor-auth-modal-map";
import { step } from "decorators/step";
import { TwoFactorAuthModalSteps } from "./two-factor-auth-modal-steps";
import { BasePage } from "@pages/base/base-page";

export class TwoFactorAuthModal extends BasePage<TwoFactorAuthModalMap> {
	constructor(page: Page) {
		super(page, new TwoFactorAuthModalMap(page));
	}

	public assertThat(): TwoFactorAuthModalAsserter {
		return new TwoFactorAuthModalAsserter(this);
	}

	public steps(): TwoFactorAuthModalSteps {
		return new TwoFactorAuthModalSteps(this);
	}

	@step()
	public async enter2FaCode(
		twoFactorAuthenticationCode: string,
	): Promise<void> {
		const inputCount = await this.map.inputFields2FACode.count();
		expect(inputCount).toBe(twoFactorAuthenticationCode.length);
		for (let i = 0; i < inputCount; i++) {
			const inputDigit = this.map.inputFields2FACode.nth(i);
			await inputDigit.fill(twoFactorAuthenticationCode[i]);
		}
	}
}
