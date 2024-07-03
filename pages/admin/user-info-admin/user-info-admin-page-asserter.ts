import { BaseAsserter } from "@base/base-asserter";
import { UserInfoAdminPage } from "./user-info-admin-page";
import { expect } from "@playwright/test";

export class UserInfoAdminPageAsserter extends BaseAsserter<UserInfoAdminPage> {
	public constructor(page: UserInfoAdminPage) {
		super(page);
	}

	public async isSearchByUsernameFieldDisplayed(): Promise<void> {
		await expect(
			this.gamdomPage.map.searchByUsernameContainer,
		).toBeVisible();
	}

	public async areNoResultsDisplayedForSearchByUsernameField(): Promise<void> {
		await expect(
			this.gamdomPage.map.searchByUsernameMenuNoResults,
		).toBeVisible();
	}

	public async isSearchByUsernameResultDisplayed(
		username: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.searchByUsernameMenuOption(username),
		).toBeVisible();
	}

	public async isShowInfoButtonDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.showUserInfoButton).toBeVisible();
	}
}
