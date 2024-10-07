import { BaseAsserter } from "@base/base-asserter";
import { UserInfoAdminPage } from "./user-info-admin-page";

export class UserInfoAdminPageAsserter extends BaseAsserter<UserInfoAdminPage> {
	public constructor(page: UserInfoAdminPage) {
		super(page);
	}

	public async isSearchByUsernameFieldDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameContainer,
		]);
	}

	public async areNoResultsDisplayedForSearchByUsernameField(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameMenuNoResults,
		]);
	}

	public async isSearchByUsernameResultDisplayed(
		username: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameMenuOption(username),
		]);
	}

	public async isShowInfoButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.showUserInfoButton,
		]);
	}
}
