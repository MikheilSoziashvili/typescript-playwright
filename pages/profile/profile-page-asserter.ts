import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { ProfilePage } from "./profile-page";
import { expect } from "@playwright/test";

export class ProfilePageAsserter extends BaseAsserter<ProfilePage> {
	public constructor(page: ProfilePage) {
		super(page);
	}

	@step("Assert verify button is not visible")
	public async assertVerifyButtonNotVisible(): Promise<void> {
		await expect(this.gamdomPage.map.verifyButton).toBeHidden();
	}

	@step("Assert phone input is visible")
	public async assertPhoneInputVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.changePhoneInput,
		]);
	}

	@step("Assert phone validation error is")
	public async phoneValidationErrorIs(errorText: string): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.phoneValidationError,
				expectedText: errorText,
			},
		]);
	}

	@step("Assert save phone button is disabled")
	public async savePhoneButtonIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([
			this.gamdomPage.map.savePhoneButton,
		]);
	}
}
