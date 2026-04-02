import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export interface CustomRewardHappyPathParams {
	adminSession: BrowserUserSession;
	userSession: BrowserUserSession;
	targetUsername: string;
	rewardType: CustomRewardType;
	rewardLabel: CustomRewardType;
	amount: string;
	initialAmount: string;
	evRequired?: number;
}

export class CustomRewardHappyPathTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	private async adminNavigateAndSetReward(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		rewardType: CustomRewardType;
		rewardLabel: CustomRewardType;
		amount: string;
		evRequired?: number;
	}): Promise<void> {
		const { adminSession, targetUsername, rewardType, rewardLabel, amount, evRequired } =
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
			.rewardVisibleInSection(RewardStatus.PENDING, rewardLabel, amount);
	}

	private async adminVerifyHistoryStatus(params: {
		adminSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
		expectedStatus: RewardStatus;
	}): Promise<void> {
		const { adminSession, rewardLabel, amount, expectedStatus } = params;

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.RewardHistory,
		);

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardsHistoryTableVisible();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(RewardsSource.REWARDS, rewardLabel, amount, expectedStatus);
	}

	private async adminRefreshAndVerifyHistoryStatus(params: {
		adminSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
		expectedStatus: RewardStatus;
	}): Promise<void> {
		const { adminSession, rewardLabel, amount, expectedStatus } = params;

		await adminSession.pages.userInfoRewardsHistoryAdminPage.refresh();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(RewardsSource.REWARDS, rewardLabel, amount, expectedStatus);
	}

	private async userActivateReward(params: {
		userSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
	}): Promise<void> {
		const { userSession, rewardLabel } = params;

		await userSession.pages.rewardsPage.navigate();

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardIsVisibleAndCanBeActivated(rewardLabel, RewardButton.ACTIVATE);

		await userSession.pages.rewardsPage.clickOnRewardButton(
			rewardLabel,
			RewardButton.ACTIVATE,
		);
	}

	private async userClaimReward(params: {
		userSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
	}): Promise<void> {
		const { userSession, rewardLabel, amount } = params;

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(rewardLabel, RewardButton.CLAIM, amount);

		await userSession.pages.rewardsPage.clickOnRewardButton(
			rewardLabel,
			RewardButton.CLAIM,
		);
	}

	private async adminRevokeReward(params: {
		adminSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		status: RewardStatus;
	}): Promise<void> {
		const { adminSession, rewardLabel, status } = params;

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminSession.pages.userInfoRewardsAdminPage
			.steps()
			.clickRevokeRewardButton(status, rewardLabel);
	}

	@testFlow("Execute reload reward full lifecycle")
	public async executeReloadLifecycle(
		params: CustomRewardHappyPathParams,
	): Promise<void> {
		const { adminSession, userSession, targetUsername, rewardType, rewardLabel, amount, initialAmount } =
			params;

		await this.adminNavigateAndSetReward({
			adminSession: adminSession,
			targetUsername: targetUsername,
			rewardType: rewardType,
			rewardLabel: rewardLabel,
			amount: amount,
		});

		await this.adminVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: initialAmount,
			expectedStatus: RewardStatus.PENDING,
		});

		await this.userActivateReward({ userSession: userSession, rewardLabel: rewardLabel });

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(rewardLabel, RewardButton.CLAIM, amount);

		await this.adminRefreshAndVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: initialAmount,
			expectedStatus: RewardStatus.ACTIVE,
		});

		await this.userClaimReward({ userSession: userSession, rewardLabel: rewardLabel, amount: amount });

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardIsClaimedAndActive(rewardLabel, RewardButton.AVAILABLE_IN);

		await this.adminRefreshAndVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.ACTIVE,
		});

		await this.adminRevokeReward({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			status: RewardStatus.ACTIVE,
		});

		await this.adminVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.CANCELED,
		});
	}

	@testFlow("Execute VIP reward full lifecycle")
	public async executeVipLifecycle(
		params: Omit<CustomRewardHappyPathParams, "initialAmount">,
	): Promise<void> {
		const { adminSession, userSession, targetUsername, rewardType, rewardLabel, amount } =
			params;

		await this.adminNavigateAndSetReward({
			adminSession: adminSession,
			targetUsername: targetUsername,
			rewardType: rewardType,
			rewardLabel: rewardLabel,
			amount: amount,
		});

		await this.adminVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.PENDING,
		});

		await userSession.pages.rewardsPage.navigate();

		await this.userClaimReward({ userSession: userSession, rewardLabel: rewardLabel, amount: amount });

		await this.adminRefreshAndVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.CLAIMED,
		});
	}

	@testFlow("Execute XP Challenge reward full lifecycle")
	public async executeXpChallengeLifecycle(
		params: Omit<CustomRewardHappyPathParams, "initialAmount">,
	): Promise<void> {
		const { adminSession, userSession, targetUsername, rewardType, rewardLabel, amount, evRequired } =
			params;

		await this.adminNavigateAndSetReward({
			adminSession: adminSession,
			targetUsername: targetUsername,
			rewardType: rewardType,
			rewardLabel: rewardLabel,
			amount: amount,
			evRequired: evRequired,
		});

		await this.adminVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.PENDING,
		});

		await this.userActivateReward({ userSession: userSession, rewardLabel: rewardLabel });

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(rewardLabel, RewardButton.CLAIM, amount);

		await this.adminRefreshAndVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.ACTIVE,
		});

		await this.userClaimReward({ userSession: userSession, rewardLabel: rewardLabel, amount: amount });

		await this.adminRefreshAndVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.CLAIMED,
		});
	}
}
