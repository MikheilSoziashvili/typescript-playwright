import { expect } from "@playwright/test";
import { BaseAsserter } from "base/base-asserter";
import { InfoAdminPage } from "./info-admin-page";

export class InfoAdminPageAsserter extends BaseAsserter<InfoAdminPage> {
	public constructor(page: InfoAdminPage) {
		super(page);
	}

	public async isUserBanned(): Promise<void> {
		await expect.soft(this.gamdomPage.map.bannedUserInfo).toBeVisible();
	}

	public async isUnbanButtonDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.unbanUserButton).toBeVisible();
	}
}
