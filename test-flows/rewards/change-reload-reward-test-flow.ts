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
		shouldToastBePresent?: boolean;
		shouldRewardBePresent?: boolean;
		expectedToastType?: ToastTitle;
	}): Promise<void> {
		const {
			adminUser,
			targetUsername,
			newRewardTotal,
			newTotalAmount,
			shouldToastBePresent = true,
			shouldRewardBePresent = true,
			expectedToastType = ToastTitle.SUCCESS,
		} = params;

		await this.navigateToRewardsTab(adminUser, targetUsername);
		await this.openEditReloadRewardForm(adminUser);
		await this.updateRewardTotal(adminUser, newRewardTotal);
		await this.verifyToastMessage(
			adminUser,
			shouldToastBePresent,
			expectedToastType,
		);
		await this.verifyRewardState(
			adminUser,
			expectedToastType,
			shouldRewardBePresent,
			newTotalAmount,
		);
	}

	@testFlow("Navigate to rewards tab")
	private async navigateToRewardsTab(
		adminUser: BrowserUserSession,
		targetUsername: string,
	): Promise<void> {
		await adminUser.pages.userInfoAdminPage
			.steps()
			.navigateAndShowUserDetails(targetUsername);

		await adminUser.pages.userInfoAdminPage.clickUserInfoTab(
			UserInfoTabs.Rewards,
		);
	}

	@testFlow("Open edit reload reward form")
	private async openEditReloadRewardForm(
		adminUser: BrowserUserSession,
	): Promise<void> {
		await adminUser.pages.userInfoRewardsAdminPage.clickChangeRewardButton(
			RewardStatus.ACTIVE,
			CustomRewardType.RELOAD,
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.editReloadRewardFormIsOpened();
	}

	@testFlow("Update reward total")
	private async updateRewardTotal(
		adminUser: BrowserUserSession,
		newRewardTotal: number,
	): Promise<void> {
		await adminUser.pages.userInfoRewardsAdminPage.setRewardTotal(
			newRewardTotal,
		);

		await adminUser.pages.userInfoRewardsAdminPage.clickSaveChangesButton();
	}

	@testFlow("Verify toast message")
	private async verifyToastMessage(
		adminUser: BrowserUserSession,
		shouldToastBePresent: boolean,
		expectedToastType: ToastTitle,
	): Promise<void> {
		if (!shouldToastBePresent) {
			return;
		}

		const isSuccessToast = expectedToastType === ToastTitle.SUCCESS;

		if (isSuccessToast) {
			await adminUser.pages.toast
				.assertThat()
				.toastMessageIs(
					ToastTitle.SUCCESS,
					ToastSubTitle.REWARD_UPDATED_SUCCESSFULLY,
				);
		} else {
			await adminUser.pages.toast.assertThat().titleIs(ToastTitle.FAILED);
		}
	}

	@testFlow("Verify reward state")
	private async verifyRewardState(
		adminUser: BrowserUserSession,
		expectedToastType: ToastTitle,
		shouldRewardBePresent: boolean,
		newTotalAmount: string,
	): Promise<void> {
		const isFailedToast = expectedToastType === ToastTitle.FAILED;

		if (isFailedToast) {
			await this.verifyFormStillOpen(adminUser);
			return;
		}

		await this.verifyRewardVisibility(
			adminUser,
			shouldRewardBePresent,
			newTotalAmount,
		);
	}

	@testFlow("Verify form still open")
	private async verifyFormStillOpen(
		adminUser: BrowserUserSession,
	): Promise<void> {
		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.editReloadRewardFormIsOpened();
	}

	@testFlow("Verify reward visibility")
	private async verifyRewardVisibility(
		adminUser: BrowserUserSession,
		shouldRewardBePresent: boolean,
		newTotalAmount: string,
	): Promise<void> {
		if (shouldRewardBePresent) {
			await adminUser.pages.userInfoRewardsAdminPage
				.assertThat()
				.rewardVisibleInSection(
					RewardStatus.ACTIVE,
					CustomRewardType.RELOAD,
					newTotalAmount,
				);
		} else {
			await adminUser.pages.userInfoRewardsAdminPage
				.assertThat()
				.noActiveRewardsVisible(RewardStatus.ACTIVE);
		}
	}
}
