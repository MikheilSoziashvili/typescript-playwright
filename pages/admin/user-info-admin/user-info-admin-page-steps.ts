import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { UserInfoAdminPage } from "./user-info-admin-page";

export class UserInfoAdminPageSteps extends BasePageStep<UserInfoAdminPage> {
	public constructor(gamdomPage: UserInfoAdminPage) {
		super(gamdomPage);
	}

	@step("Search user")
	public async searchUser(parameters: {
		username: string;
		expectToBeFound?: boolean;
	}): Promise<void> {
		const { username, expectToBeFound } = parameters;
		await this.gamdomPage.map.searchByUsernameContainer.click();
		await this.gamdomPage.map.searchByUsernameInput.clear();
		await this.gamdomPage.map.searchByUsernameInput.pressSequentially(
			username,
		);

		if (expectToBeFound) {
			await this.gamdomPage
				.assertThat()
				.isSearchByUsernameResultDisplayed(username);
		} else {
			await this.gamdomPage
				.assertThat()
				.areNoResultsDisplayedForSearchByUsernameField();
		}
	}

	@step("Show user details")
	public async showUserDetails(username: string): Promise<void> {
		await this.searchUser({
			username: username,
			expectToBeFound: true,
		});
		await this.gamdomPage.selectUsernameFromSearchForUsernameFiledResults(
			username,
		);
		await this.gamdomPage.map.showUserInfoButton.click();
	}

	@step("Navigate and show user details")
	public async navigateAndShowUserDetails(username: string): Promise<void> {
		await this.gamdomPage.navigate();
		await this.showUserDetails(username);
	}
}
