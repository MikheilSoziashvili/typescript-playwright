import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { RewardStatus } from "@enums/admin/reward-status";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export class ReloadRewardActivationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Activate Reload reward")
	public async activateReloadReward(params: {
		user: BrowserUserSession;
		amount: string;
	}): Promise<void> {
		const { user, amount } = params;

		await user.pages.rewardsPage.navigate();

		await user.pages.rewardsPage
			.assertThat()
			.rewardIsVisibleAndCanBeActivated(
				CustomRewardType.RELOADS,
				RewardButton.ACTIVATE,
			);

		await user.pages.rewardsPage.clickOnRewardButton(
			CustomRewardType.RELOAD,
			RewardButton.ACTIVATE,
		);

		await user.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(
				CustomRewardType.RELOAD,
				RewardButton.CLAIM,
				amount,
			);
	}

	@testFlow("Verify Reload reward is active in admin panel")
	public async verifyReloadRewardIsActive(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		totalAmount: string;
	}): Promise<void> {
		const { adminUser, targetUsername, totalAmount } = params;

		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(
				RewardStatus.ACTIVE,
				CustomRewardType.RELOAD,
				totalAmount,
			);
	}
}
