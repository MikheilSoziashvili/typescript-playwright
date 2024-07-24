import { BaseAsserter } from "@base/base-asserter";
import { ProfilePage } from "./profile-page";
import { expect } from "@playwright/test";

export class ProfilePageAsserter extends BaseAsserter<ProfilePage> {
	public constructor(page: ProfilePage) {
		super(page);
	}

	public async assertVerifyButtonNotVisible(): Promise<void> {
		await expect(this.gamdomPage.map.verifyButton).toBeHidden();
	}

	public async assertChangeEmailButtonVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.changeEmailButton,
		]);
	}
}
