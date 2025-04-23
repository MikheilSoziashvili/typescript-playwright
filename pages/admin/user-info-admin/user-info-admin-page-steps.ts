import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoAdminPage } from "./user-info-admin-page";
import { Timeout } from "@enums/timeout";

export class UserInfoAdminPageSteps extends BasePageStep<UserInfoAdminPage> {
	public constructor(gamdomPage: UserInfoAdminPage) {
		super(gamdomPage);
	}

	public async searchUser(parameters: {
		username: string;
		expectToBeFound?: boolean;
	}): Promise<void> {
		const { username, expectToBeFound } = parameters;
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.searchByUsernameInput,
			timeout: Timeout.MEDIUM,
		});
		// Due to Webkit failures (unable to click on elements) explicit wait + force click is required
		// eslint-disable-next-line playwright/no-force-option
		await this.gamdomPage.map.searchByUsernameInput.click({ force: true });
		await this.gamdomPage.map.searchByUsernameInput.fill(username);

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

	public async navigateAndShowUserDetails(username: string): Promise<void> {
		await this.gamdomPage.navigate();
		await this.showUserDetails(username);
	}
}
