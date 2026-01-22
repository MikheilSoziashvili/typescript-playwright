import { step } from "decorators/step";
import { BaseAsserter } from "@base/base-asserter";
import { UserProfileModalV4 } from "./user-profile-modal-v4";

export class UserProfileModalAsserterV4 extends BaseAsserter<UserProfileModalV4> {
	public constructor(page: UserProfileModalV4) {
		super(page);
	}

	@step("Check user profile modal is displayed")
	public async isDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userProfileModalContainerV4,
		]);
	}

	@step("Check private user mode is displayed")
	public async isPrivateUserModeDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.userProfilePrivateStatisticsContainerV4,
			this.gamdomPage.map.userProfilePrivateStatisticsMessageV4,
		]);

		await this.checkElementsHaveText([
			{
				locator:
					this.gamdomPage.map.userProfilePrivateStatisticsMessageV4,
				expectedText: "This user has Private Statistics",
			},
		]);
	}
}
