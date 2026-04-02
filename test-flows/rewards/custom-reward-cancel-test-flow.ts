import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export interface CustomRewardCancelParams {
	adminSession: BrowserUserSession;
	targetUsername: string;
	rewardType: CustomRewardType;
	rewardLabel: CustomRewardType;
	amount: string;
	initialStatus: RewardStatus;
	evRequired?: number;
}

export class CustomRewardCancelTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	private async adminNavigateAndSetReward(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		rewardType: CustomRewardType;
		rewardLabel: CustomRewardType;
		amount: string;
		initialStatus: RewardStatus;
		evRequired?: number;
	}): Promise<void> {
		const { adminSession, targetUsername, rewardType, rewardLabel, amount, initialStatus, evRequired } =
			params;

		await adminSession.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminSession.pages.userInfoRewardsAdminPage
			.assertThat()
			.newCustomRewardButtonVisible();

		await adminSession.pages.userInfoRewardsAdminPage
			.steps()
			.setCustomReward(rewardType, evRequired);

		await adminSession.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(initialStatus, rewardLabel, amount);
	}

	private async adminRevokeAndVerifyCanceled(params: {
		adminSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
		initialStatus: RewardStatus;
	}): Promise<void> {
		const { adminSession, rewardLabel, amount, initialStatus } = params;

		await adminSession.pages.userInfoRewardsAdminPage
			.steps()
			.clickRevokeRewardButton(initialStatus, rewardLabel);

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.RewardHistory,
		);

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardsHistoryTableVisible();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(
				RewardsSource.REWARDS,
				rewardLabel,
				amount,
				RewardStatus.CANCELED,
			);
	}

	@testFlow("Admin: set reward, revoke, and verify canceled in history")
	public async executeCancel(
		params: CustomRewardCancelParams,
	): Promise<void> {
		const { adminSession, targetUsername, rewardType, rewardLabel, amount, initialStatus, evRequired } =
			params;

		await this.adminNavigateAndSetReward({
			adminSession: adminSession,
			targetUsername: targetUsername,
			rewardType: rewardType,
			rewardLabel: rewardLabel,
			amount: amount,
			initialStatus: initialStatus,
			evRequired: evRequired,
		});

		await this.adminRevokeAndVerifyCanceled({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			initialStatus: initialStatus,
		});
	}
}
