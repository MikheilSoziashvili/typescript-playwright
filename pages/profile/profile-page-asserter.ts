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
}
