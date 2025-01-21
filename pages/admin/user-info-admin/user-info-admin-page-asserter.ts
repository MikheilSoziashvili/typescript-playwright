import { BaseAsserter } from "@base/base-asserter";
import { UserInfoAdminPage } from "./user-info-admin-page";
import { step } from "decorators/step";

export class UserInfoAdminPageAsserter extends BaseAsserter<UserInfoAdminPage> {
	public constructor(page: UserInfoAdminPage) {
		super(page);
	}

	@step(`Verify 'Search by Username' field is displayed`)
	public async isSearchByUsernameFieldDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameContainer,
		]);
	}

	@step()
	public async searchByIPElementsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByIPContainer,
			this.gamdomPage.map.searchByIPInput,
			this.gamdomPage.map.searchIPAddressButton,
			this.gamdomPage.map.searchByIPLabel,
		]);
	}

	@step()
	public async areNoResultsDisplayedForSearchByUsernameField(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameMenuNoResults,
		]);
	}

	@step(`Verify 'Search by Username' results are displayed`)
	public async isSearchByUsernameResultDisplayed(
		username: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameMenuOption(username),
		]);
	}

	@step(`Verify 'Show user info' button is displayed`)
	public async isShowInfoButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.showUserInfoButton,
		]);
	}
}
