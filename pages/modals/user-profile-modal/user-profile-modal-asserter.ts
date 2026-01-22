import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { UserProfileModal } from "./user-profile-modal";

export class UserProfileModalAsserter extends BaseAsserter<UserProfileModal> {
	public constructor(page: UserProfileModal) {
		super(page);
	}

	@step("Check user profile modal is displayed")
	public async isDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userProfileModalContainer,
		]);
	}

	@step("Check private user mode is displayed")
	public async isPrivateUserModeDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userProfilePrivateStatisticsContainer,
			this.gamdomPage.map.tipUserButton,
			this.gamdomPage.map.ignoreButton,
		]);
	}
}
