import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { NotificationSubTitle } from "@enums/notification-subtitles";
import { NotificationTitle } from "@enums/notification-titles";

export interface CustomRewardKycParams {
	adminSession: BrowserUserSession;
	userSession: BrowserUserSession;
	targetUsername: string;
	amount: string;
}

export class CustomRewardKycTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	private async adminSetKycRewardAndVerifyActive(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		rewardLabel: CustomRewardType;
		amount: string;
	}): Promise<void> {
		const { adminSession, targetUsername, rewardLabel, amount } = params;

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
			.setCustomReward(CustomRewardType.KYC_VERIFICATION);

		await adminSession.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(RewardStatus.ACTIVE, rewardLabel, amount);
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

	private async userCompleteKycVerification(params: {
		userSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
	}): Promise<void> {
		const { userSession, rewardLabel, amount } = params;

		await userSession.pages.rewardsPage.navigate();

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardIsVisibleAndCanBeActivated(rewardLabel, amount);

		await userSession.pages.rewardsPage.clickOnRewardButton(rewardLabel, amount);

		await userSession.pages.verificationPage.fillInKycLevel1Form();

		const notification = userSession.pages.homePage.getNotification();
		await notification.assertThat().titleIs(NotificationTitle.KYC_VERIFIED);
		await notification
			.assertThat()
			.subTitleIs(NotificationSubTitle.KYC_LEVEL_ONE_VERIFIED);
	}

	private async userClaimKycReward(params: {
		userSession: BrowserUserSession;
		rewardLabel: CustomRewardType;
		amount: string;
	}): Promise<void> {
		const { userSession, rewardLabel, amount } = params;

		await userSession.pages.rewardsPage.navigate();

		await userSession.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(rewardLabel, RewardButton.CLAIM, amount);

		await userSession.pages.rewardsPage.clickOnRewardButton(
			rewardLabel,
			RewardButton.CLAIM,
		);
	}

	@testFlow("Execute KYC Verification reward full lifecycle")
	public async executeKycLifecycle(
		params: CustomRewardKycParams,
	): Promise<void> {
		const { adminSession, userSession, targetUsername, amount } = params;
		const rewardLabel = CustomRewardType.KYC_VERIFICATION_LABEL;

		await this.adminSetKycRewardAndVerifyActive({
			adminSession: adminSession,
			targetUsername: targetUsername,
			rewardLabel: rewardLabel,
			amount: amount,
		});

		await this.adminVerifyHistoryStatus({
			adminSession: adminSession,
			rewardLabel: rewardLabel,
			amount: amount,
			expectedStatus: RewardStatus.ACTIVE,
		});

		await this.userCompleteKycVerification({
			userSession: userSession,
			rewardLabel: rewardLabel,
			amount: amount,
		});

		await this.userClaimKycReward({
			userSession: userSession,
			rewardLabel: rewardLabel,
			amount: amount,
		});

		await adminSession.pages.userInfoRewardsHistoryAdminPage.refresh();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(
				RewardsSource.REWARDS,
				rewardLabel,
				amount,
				RewardStatus.CLAIMED,
			);
	}
}
