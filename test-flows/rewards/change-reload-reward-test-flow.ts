import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";

export class ChangeReloadRewardTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Change reload reward through admin UI")
	public async changeReloadReward(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		newRewardTotal: number;
		newTotalAmount: string;
	}): Promise<void> {
		const { adminUser, targetUsername, newRewardTotal, newTotalAmount } =
			params;

		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);

		await adminUser.pages.userInfoRewardsAdminPage.clickChangeRewardButton(
			RewardStatus.ACTIVE,
			CustomRewardType.RELOAD,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.editReloadRewardFormIsOpened();

		await adminUser.pages.userInfoRewardsAdminPage.setRewardTotal(
			newRewardTotal,
		);

		await adminUser.pages.userInfoRewardsAdminPage.clickSaveChangesButton();

		await adminUser.pages.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.REWARD_UPDATED_SUCCESSFULLY,
			);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.rewardVisibleInSection(
				RewardStatus.ACTIVE,
				CustomRewardType.RELOAD,
				newTotalAmount,
			);
	}
}
