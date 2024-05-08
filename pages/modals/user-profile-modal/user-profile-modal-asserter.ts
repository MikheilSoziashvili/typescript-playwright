import { expect } from "@playwright/test";
import { BaseAsserter } from "base/base-asserter";
import { UserProfileModal } from "./user-profile-modal";

export class UserProfileModalAsserter extends BaseAsserter<UserProfileModal> {
	public constructor(page: UserProfileModal) {
		super(page);
	}

	public async isDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.modalLocator).toBeVisible();
	}

	public async isPrivateUserModeDisplayed(): Promise<void> {
		await expect(
			this.gamdomPage.map.privateStatisticsLocator,
		).toBeVisible();
		await expect(this.gamdomPage.map.tipUserButton).toBeVisible();
		await expect(this.gamdomPage.map.ignoreButton).toBeVisible();
	}
}
