import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";

export class XpChallengeAdminSetupFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Setup XP Challenge reward for user")
	public async setupXpChallengeReward(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		evRequired: number;
		challengeDuration: number;
		rewardAmount: number;
	}): Promise<void> {
		const {
			adminUser,
			targetUsername,
			evRequired,
			challengeDuration,
			rewardAmount,
		} = params;

		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.noActiveRewardsVisible(RewardStatus.ACTIVE);

		await adminUser.pages.userInfoRewardsAdminPage.setCustomXpChallengeReward(
			evRequired,
			challengeDuration,
			rewardAmount,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(
				RewardStatus.PENDING,
				CustomRewardType.XP_CHALLENGE,
				rewardAmount.toString(),
			);
	}
}
