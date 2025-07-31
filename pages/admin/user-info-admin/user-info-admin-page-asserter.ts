import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { step } from "decorators/step";
import { UserInfoAdminPage } from "./user-info-admin-page";

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

	@step("Search by IPElements displayed")
	public async searchByIPElementsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByIPContainer,
			this.gamdomPage.map.searchByIPInput,
			this.gamdomPage.map.searchIPAddressButton,
			this.gamdomPage.map.searchByIPLabel,
		]);
	}

	@step("Search by Steam64 or UserId elements displayed")
	public async searchBySteam64orUserIdElementsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchBySteam64OrUserIdContainer,
			this.gamdomPage.map.searchBySteam64OrUserIdInput,
		]);
	}

	@step("No results are displayed for SearchByUsername field")
	public async areNoResultsDisplayedForSearchByUsernameField(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.searchByUsernameMenuNoResults,
		]);
	}

	@step(`Verify 'Search by Username' results are displayed`)
	public async isSearchByUsernameResultDisplayed(
		username: string,
	): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.searchByUsernameMenuOption(username)],
			Timeout.LONG,
		);
	}

	@step(`Verify 'Show user info' button is displayed`)
	public async isShowInfoButtonDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.showUserInfoButton,
		]);
	}

	@step("Check if badge is displayed")
	public async isBadgeDisplayed(badgeName: string): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userBadgeByName(badgeName),
		]);
	}
}
