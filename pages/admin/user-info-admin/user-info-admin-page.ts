import { BasePage } from "@base/base-page";
import { USER_INFO_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Page } from "@playwright/test";
import { UserInfoAdminPageAsserter } from "./user-info-admin-page-asserter";
import { UserInfoAdminPageMap } from "./user-info-admin-page-map";
import { UserInfoAdminPageSteps } from "./user-info-admin-page-steps";

export class UserInfoAdminPage extends BasePage<UserInfoAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [USER_INFO_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): UserInfoAdminPageAsserter {
		return new UserInfoAdminPageAsserter(this);
	}

	public steps(): UserInfoAdminPageSteps {
		return new UserInfoAdminPageSteps(this);
	}

	@step("Click SearchByUsername field")
	public async clickSearchByUsernameField(): Promise<void> {
		await this.map.searchByUsernameContainer.click();
	}

	@step("Click SearchByIp field")
	public async clickSearchByIPField(): Promise<void> {
		await this.map.searchByIPInput.click();
	}

	@step("Insert username in search field")
	public async insertUsernameInSearchByUsernameInput(
		username: string,
	): Promise<void> {
		await this.map.searchByUsernameInput.fill(username);
	}

	@step("Select username from search results")
	public async selectUsernameFromSearchForUsernameFiledResults(
		username: string,
	): Promise<void> {
		const usernameOption = this.map.searchByUsernameMenuOption(username);
		await usernameOption.click();
	}

	@step("Insert IP address in search field")
	public async insertIPInSearchByIPInput(ipAddress: string): Promise<void> {
		await this.map.searchByIPInput.fill(ipAddress);
	}

	@step("Search for IP address")
	public async searchForIP(ipAddress: string): Promise<void> {
		await this.insertIPInSearchByIPInput(ipAddress);
		await this.performReliableClick(this.map.searchIPAddressButton);
	}

	@step("Insert Steam64 or UserId in search field")
	public async insertSteam64OrUserIdInSearchBySteam64OrUserIdInput(
		steam64OrUserId: string | number,
	): Promise<void> {
		await this.map.searchBySteam64OrUserIdInput.fill(
			steam64OrUserId.toString(),
		);
	}

	@step("Search for Steam64 or UserId")
	public async searchForSteam64OrUserId(
		steam64OrUserId: string | number,
	): Promise<void> {
		await this.insertSteam64OrUserIdInSearchBySteam64OrUserIdInput(
			steam64OrUserId,
		);
		await this.map.showUserInfoButton.click();
	}
}
