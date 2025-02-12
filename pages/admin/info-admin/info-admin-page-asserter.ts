import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { InfoAdminPage } from "./info-admin-page";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";

export class InfoAdminPageAsserter extends BaseAsserter<InfoAdminPage> {
	public constructor(page: InfoAdminPage) {
		super(page);
	}

	@step("Check if page elements are visible")
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

	@step("Check username is displayed in title")
	public async isUsernameDisplayedInTitle(username: string): Promise<void> {
		await expect(this.gamdomPage.map.adminTitle).toHaveText(
			`Admin user info: ${username}`,
		);
	}

	@step("Check user is banned")
	public async isUserBanned(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.bannedUserInfo,
		]);
	}

	@step("Check unban button is displayed")
	public async isUnbanButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.unbanUserButton,
		]);
	}

	@step("Check tip user container is displayed")
	public async isTipUserContainerDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.tipUserContainer,
		]);
	}
}
