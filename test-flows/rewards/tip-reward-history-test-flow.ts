import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { buildTipUserSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import {
	createPngImagePath,
	deleteFilesWithFilePaths,
} from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";

export interface TipRewardHistoryParams {
	adminSession: BrowserUserSession;
	targetUsername: string;
	tipAmount: number;
	expectedAmount: string;
	tipType: string;
	rewardType: CustomRewardType;
}

export class TipRewardHistoryTestFlow extends BaseTestFlow {
	private qrCode2FAImagePath = "";

	constructor() {
		super();
	}

	private async setup2FaAndTipUser(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		tipAmount: number;
		tipType: string;
	}): Promise<void> {
		const { adminSession, targetUsername, tipAmount, tipType } = params;

		this.qrCode2FAImagePath = createPngImagePath();

		await adminSession.pages.settingsPage
			.steps()
			.navigateAndEnable2FaAuthentication(this.qrCode2FAImagePath);

		await adminSession.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminSession.pages.infoAdminPage
			.steps()
			.tipUserWith2FaFlow(tipAmount, this.qrCode2FAImagePath, tipType);

		await adminSession.pages.toast.assertThat().subTitleIs(
			buildTipUserSubTitle({
				username: targetUsername,
				tipAmount: tipAmount,
			}),
		);
	}

	private async verifyTipInRewardsHistory(params: {
		adminSession: BrowserUserSession;
		rewardType: CustomRewardType;
		expectedAmount: string;
	}): Promise<void> {
		const { adminSession, rewardType, expectedAmount } = params;

		await adminSession.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.RewardHistory,
		);

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardsHistoryTableVisible();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(
				RewardsSource.TIP,
				rewardType,
				expectedAmount,
				RewardStatus.COMPLETED,
			);
	}

	@testFlow("Tip user with 2FA and verify in rewards history")
	public async executeTipAndVerifyHistory(
		params: TipRewardHistoryParams,
	): Promise<void> {
		const { adminSession, targetUsername, tipAmount, expectedAmount, tipType, rewardType } =
			params;

		await this.setup2FaAndTipUser({
			adminSession: adminSession,
			targetUsername: targetUsername,
			tipAmount: tipAmount,
			tipType: tipType,
		});

		await this.verifyTipInRewardsHistory({
			adminSession: adminSession,
			rewardType: rewardType,
			expectedAmount: expectedAmount,
		});

		await deleteFilesWithFilePaths([this.qrCode2FAImagePath]);
	}
}
