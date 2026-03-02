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

	@step("Assert change phone button is visible")
	public async assertChangePhoneButtonVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.changePhoneButton,
		]);
	}
}
