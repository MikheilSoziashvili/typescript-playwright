import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { UserProfileModal } from "./user-profile-modal";

export class UserProfileModalAsserter extends BaseAsserter<UserProfileModal> {
	public constructor(page: UserProfileModal) {
		super(page);
	}

	@step("Check user profile modal is displayed")
	public async isDisplayed(): Promise<void> {
		await expect(
			this.gamdomPage.map.userProfileModalContainer,
		).toBeVisible();
	}

	@step("Check private user mode is displayed")
	public async isPrivateUserModeDisplayed(): Promise<void> {
		await expect(
			this.gamdomPage.map.userProfilePrivateStatisticsContainer,
		).toBeVisible();
		await expect(this.gamdomPage.map.tipUserButton).toBeVisible();
		await expect(this.gamdomPage.map.ignoreButton).toBeVisible();
	}
}
