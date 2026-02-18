import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";

export class ReloadRewardAdminSetupFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Setup Reload reward for user")
	public async setupReloadReward(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		amount: string;
	}): Promise<void> {
		const { adminUser, targetUsername, amount } = params;

		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.newCustomRewardButtonVisible();

		await adminUser.pages.userInfoRewardsAdminPage
			.steps()
			.setCustomReward(CustomRewardType.RELOAD);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(
				RewardStatus.PENDING,
				CustomRewardType.RELOAD,
				amount,
			);
	}
}
