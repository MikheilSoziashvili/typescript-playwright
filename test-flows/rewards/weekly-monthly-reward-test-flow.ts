import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { getCookieHeader } from "@core/utils/utils";
import { BulkRewardTestData } from "@dtos/test-data";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardStatus } from "@enums/admin/reward-status";
import { RewardType } from "@enums/admin/reward-type";
import { RewardsSource } from "@enums/admin/rewards-source";
import { UserInfoTabs } from "@enums/admin/user-info-tabs";
import { GamdomApi } from "@api/gamdom-api";
import { getISOWeek, getMonth, getYear } from "date-fns";

export class WeeklyMonthlyRewardTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	private async sendBulkReward(params: {
		adminSession: BrowserUserSession;
		gamdomApi: GamdomApi;
		targetUserId: number;
		rewardCoins: number;
		periodIdentifier: string;
	}): Promise<void> {
		const { adminSession, gamdomApi, targetUserId, rewardCoins, periodIdentifier } =
			params;

		const adminCookie = getCookieHeader(
			adminSession.getAuthenticatedUser().cookie,
		);

		const bulkRewardData = new BulkRewardTestData(
			CustomRewardType.EV_REWARD,
			[{ userId: Number(targetUserId), rewardCoins: rewardCoins }],
			periodIdentifier,
		);

		await gamdomApi.bulkReward(bulkRewardData, undefined, {
			Cookie: adminCookie,
		});
	}

	private async adminNavigateAndVerifyHistoryStatus(params: {
		adminSession: BrowserUserSession;
		targetUsername: string;
		expectedAmount: string;
		expectedStatus: RewardStatus;
	}): Promise<void> {
		const { adminSession, targetUsername, expectedAmount, expectedStatus } = params;

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
			.rewardStatusIs(
				RewardsSource.REWARDS,
				CustomRewardType.EV_REWARD_LABEL,
				expectedAmount,
				expectedStatus,
			);
	}

	private async adminRefreshAndVerifyClaimedStatus(params: {
		adminSession: BrowserUserSession;
		expectedAmount: string;
	}): Promise<void> {
		const { adminSession, expectedAmount } = params;

		await adminSession.pages.userInfoRewardsHistoryAdminPage.refresh();

		await adminSession.pages.userInfoRewardsHistoryAdminPage
			.assertThat()
			.rewardStatusIs(
				RewardsSource.REWARDS,
				CustomRewardType.EV_REWARD_LABEL,
				expectedAmount,
				RewardStatus.CLAIMED,
			);
	}

	private buildWeeklyPeriodIdentifier(): string {
		const year = getYear(new Date());
		const week = getISOWeek(new Date());
		return `weekly-${year}-W${String(week).padStart(2, "0")}`;
	}

	private buildMonthlyPeriodIdentifier(): string {
		const year = getYear(new Date());
		const month = getMonth(new Date()) + 1;
		return `monthly-${year}-${String(month).padStart(2, "0")}`;
	}

	@testFlow("Send weekly bulk reward and verify in rewards history")
	public async executeWeeklyRewardLifecycle(params: {
		adminSession: BrowserUserSession;
		userSession: BrowserUserSession;
		targetUsername: string;
		targetUserId: number;
		gamdomApi: GamdomApi;
		rewardCoins: number;
		expectedAmount: string;
	}): Promise<void> {
		const { adminSession, userSession, targetUsername, targetUserId, gamdomApi, rewardCoins, expectedAmount } =
			params;

		await this.sendBulkReward({
			adminSession: adminSession,
			gamdomApi: gamdomApi,
			targetUserId: targetUserId,
			rewardCoins: rewardCoins,
			periodIdentifier: this.buildWeeklyPeriodIdentifier(),
		});

		await userSession.pages.rewardsPage.navigate();
		await userSession.pages.rewardsPage
			.assertThat()
			.weeklyRewardIsVisibleAndAvailable();

		await this.adminNavigateAndVerifyHistoryStatus({
			adminSession: adminSession,
			targetUsername: targetUsername,
			expectedAmount: expectedAmount,
			expectedStatus: RewardStatus.PENDING,
		});

		await userSession.pages.rewardsPage.claimReward(RewardType.WEEKLY);

		await this.adminRefreshAndVerifyClaimedStatus({
			adminSession: adminSession,
			expectedAmount: expectedAmount,
		});
	}

	@testFlow("Send monthly bulk reward and verify in rewards history")
	public async executeMonthlyRewardLifecycle(params: {
		adminSession: BrowserUserSession;
		userSession: BrowserUserSession;
		targetUsername: string;
		targetUserId: number;
		gamdomApi: GamdomApi;
		rewardCoins: number;
		expectedAmount: string;
	}): Promise<void> {
		const { adminSession, userSession, targetUsername, targetUserId, gamdomApi, rewardCoins, expectedAmount } =
			params;

		await this.sendBulkReward({
			adminSession: adminSession,
			gamdomApi: gamdomApi,
			targetUserId: targetUserId,
			rewardCoins: rewardCoins,
			periodIdentifier: this.buildMonthlyPeriodIdentifier(),
		});

		await userSession.pages.rewardsPage.navigate();
		await userSession.pages.rewardsPage
			.assertThat()
			.monthlyRewardIsVisibleAndAvailable();

		await this.adminNavigateAndVerifyHistoryStatus({
			adminSession: adminSession,
			targetUsername: targetUsername,
			expectedAmount: expectedAmount,
			expectedStatus: RewardStatus.PENDING,
		});

		await userSession.pages.rewardsPage.claimReward(RewardType.MONTHLY);

		await this.adminRefreshAndVerifyClaimedStatus({
			adminSession: adminSession,
			expectedAmount: expectedAmount,
		});
	}
}
