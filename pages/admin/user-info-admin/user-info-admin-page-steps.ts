import { BasePageStep } from "../../../core/helpers/base-page-step";
import { UserInfoAdminPage } from "./user-info-admin-page";

export class UserInfoAdminPageSteps extends BasePageStep<UserInfoAdminPage> {
	public constructor(gamdomPage: UserInfoAdminPage) {
		super(gamdomPage);
	}

	public async showUserDetails(username: string): Promise<void> {
		await this.gamdomPage.map.seachByUsernameInput.fill(username);
		await this.gamdomPage.map.seachByUsernameMenuOption(username).click();
		await this.gamdomPage.map.showUserInfoButton.click();
	}
}
