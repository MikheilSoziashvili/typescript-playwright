import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoRewardsAdminPage } from "./user-info-rewards-admin-page";
import { step } from "decorators/step";
import { CustomRewardType } from "@enums/admin/custom-reward-type";

export class UserInfoRewardsAdminPageSteps extends BasePageStep<UserInfoRewardsAdminPage> {
	public constructor(gamdomPage: UserInfoRewardsAdminPage) {
		super(gamdomPage);
	}

	@step("Set custom reward")
	public async setCustomReward(
		reward: string,
		evRequired?: number,
	): Promise<void> {
		this.gamdomPage.acceptDialog();
		await this.gamdomPage.clickNewCustomRewardButton();
		await this.gamdomPage.selectRewardType(reward);
		if (
			reward === CustomRewardType.XP_CHALLENGE &&
			evRequired !== undefined
		) {
			await this.gamdomPage.setXPChallengeEvRequired(evRequired);
		}
		await this.gamdomPage.clickSetRewardButton();
	}

	@step("Click on Revoke reward button")
	public async clickRevokeRewardButton(
		section: string,
		reward: string,
	): Promise<void> {
		this.gamdomPage.acceptDialog();
		await this.gamdomPage.map.revokeRewardButton(section, reward).click();
	}
}
