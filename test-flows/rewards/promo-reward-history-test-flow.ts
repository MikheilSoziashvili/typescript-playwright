import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
} from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export class PromoRewardHistoryTestFlow extends BaseTestFlow {
	private qrCode2FAImagePath = "";

	constructor() {
		super();
	}

	private async setup2FaAuthentication(
		adminSession: BrowserUserSession,
	): Promise<void> {
		this.qrCode2FAImagePath = createPngImagePath();

		await adminSession.pages.settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(this.qrCode2FAImagePath);
	}

	private async openCampaignCreationWith2Fa(
		adminSession: BrowserUserSession,
	): Promise<void> {
		await adminSession.pages.promoCampaignsAdminPage.navigate();
		await adminSession.pages.promoCampaignsAdminPage.clickCreateCampaignButton();

		await adminSession.pages.twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(this.qrCode2FAImagePath);
	}

	private async userRedeemPromoCode(params: {
		userSession: BrowserUserSession;
		campaignCode: string;
	}): Promise<void> {
		const { userSession, campaignCode } = params;

		await userSession.pages.homePage.navigateToWallet();

		await userSession.pages.walletModal
			.steps()
			.redeemPromoCodeSuccessfully(campaignCode);
	}

	private async adminVerifyRewardInHistory(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		source: RewardsSource;
		rewardType: CustomRewardType;
		expectedValue: string;
		expectedStatus: RewardStatus;
	}): Promise<void> {
		const { adminSession, targetUsername, source, rewardType, expectedValue, expectedStatus } =
			params;

		await adminSession.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.RewardHistory,
		);

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardsHistoryTableVisible();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(source, rewardType, expectedValue, expectedStatus);
	}

	private async cleanup(): Promise<void> {
		await deleteFilesWithFilePaths([this.qrCode2FAImagePath]);
	}

	@testFlow("Setup 2FA and create cash promo campaign, then verify history")
	public async executeCashPromoRewardHistory(params: {
		adminSession: BrowserUserSession;
		userSession: BrowserUserSession;
		targetUsername: string;
		campaignName: string;
		campaignCode: string;
		expectedAmount: string;
	}): Promise<void> {
		const { adminSession, userSession, targetUsername, campaignName, campaignCode, expectedAmount } =
			params;

		await this.setup2FaAuthentication(adminSession);
		await this.openCampaignCreationWith2Fa(adminSession);

		await adminSession.pages.promoCodeModal
			.steps()
			.createDefaultCashPromoCodeSuccessfully(campaignName, campaignCode);

		await this.userRedeemPromoCode({
			userSession: userSession,
			campaignCode: campaignCode,
		});

		await this.adminVerifyRewardInHistory({
			adminSession: adminSession,
			targetUsername: targetUsername,
			source: RewardsSource.PROMO_CAMPAIGN_CASH,
			rewardType: CustomRewardType.CASH,
			expectedValue: expectedAmount,
			expectedStatus: RewardStatus.CLAIMED,
		});

		await this.cleanup();
	}

	@testFlow(
		"Setup 2FA and create free spins promo campaign, then verify history",
	)
	public async executeFreeSpinsPromoRewardHistory(params: {
		adminSession: BrowserUserSession;
		userSession: BrowserUserSession;
		targetUsername: string;
		campaignName: string;
		campaignCode: string;
		expectedFreeSpinsValue: string;
	}): Promise<void> {
		const {
			adminSession,
			userSession,
			targetUsername,
			campaignName,
			campaignCode,
			expectedFreeSpinsValue,
		} = params;

		await this.setup2FaAuthentication(adminSession);
		await this.openCampaignCreationWith2Fa(adminSession);

		await adminSession.pages.promoCodeModal
			.steps()
			.createDefaultFreeSpinsPromoCodeSuccessfully(campaignName, campaignCode);

		await this.userRedeemPromoCode({
			userSession: userSession,
			campaignCode: campaignCode,
		});

		await this.adminVerifyRewardInHistory({
			adminSession: adminSession,
			targetUsername: targetUsername,
			source: RewardsSource.PROMO_CAMPAIGN_FREE_SPINS,
			rewardType: CustomRewardType.FREE_SPINS,
			expectedValue: expectedFreeSpinsValue,
			expectedStatus: RewardStatus.ACTIVE,
		});

		await this.cleanup();
	}
}
