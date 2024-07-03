import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { InfoAdminPage } from "./info-admin-page";
import { Timeout } from "@enums/timeout";

export class InfoAdminPageAsserter extends BaseAsserter<InfoAdminPage> {
	public constructor(page: InfoAdminPage) {
		super(page);
	}

	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.adminInfoTable,
				this.gamdomPage.map.userInfoTab,
				this.gamdomPage.map.tipButton,
				this.gamdomPage.map.sendNotificationButton,
			],
			Timeout.MAX,
		);
	}

	public async isUsernameDisplayedInTitle(username: string): Promise<void> {
		await expect(this.gamdomPage.map.adminTitle).toHaveText(
			`Admin user info: ${username}`,
		);
	}

	public async isUserBanned(): Promise<void> {
		await expect(this.gamdomPage.map.bannedUserInfo).toBeVisible();
	}

	public async isUnbanButtonDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.unbanUserButton).toBeVisible();
	}
}
