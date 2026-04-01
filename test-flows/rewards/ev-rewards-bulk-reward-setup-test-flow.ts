import {
	BrowserSessionManager,
	BrowserUserSession,
} from "@core/browser-session-mngmt";
import { RewardType } from "@enums/admin/reward-type";
import { HttpStatus } from "@enums/http-status";
import { TestUserRole } from "@enums/test-user-roles";
import { expect } from "@playwright/test";
import { BaseTestFlow, testFlow } from "@test-flows";
import { predefined } from "test-data/sources/predefined";

export class EvRewardsBulkRewardSetupTestFlow extends BaseTestFlow {
	constructor(private readonly browserSessionManager: BrowserSessionManager) {
		super();
	}

	@testFlow("Setup: Send bulk EV reward to user")
	public async setupBulkReward(
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY,
	): Promise<BrowserUserSession> {
		const superAdmin = await this.browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		const regularUser = await this.browserSessionManager.loginAs(
			TestUserRole.REGULAR,
		);

		const { userId: rawUserId } = regularUser.getAuthenticatedUser().user;
		const userId = Number(rawUserId);
		const superAdminApi = await superAdmin.apis.gamdomApi;

		const { periodIdentifiers } =
			await superAdminApi.getEvReportPeriodIdentifiers(rewardType);

		expect(
			periodIdentifiers.length,
			"Expected at least one period identifier to exist",
		).toBeGreaterThan(0);

		const response = await superAdminApi.bulkReward({
			rewardType: RewardType.EV_REWARD,
			rewards: [
				{
					userId: userId,
					rewardCoins: predefined.evRewards.rewardAmountCoins,
				},
			],
			periodIdentifier: periodIdentifiers[0],
			overrideKey: null,
			startDate: null,
		});

		expect(response.successLogs).toContain(
			`Successfully rewarded user #${userId} with ${predefined.evRewards.rewardAmountCoins} coins.`,
		);

		return regularUser;
	}

	@testFlow("Setup: Call bulk reward with missing userId expecting error")
	public async callBulkRewardWithMissingUserId(
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY,
	): Promise<void> {
		const superAdmin = await this.browserSessionManager.loginAs(
			TestUserRole.SUPERADMIN,
			{ reuseContext: true },
		);
		const superAdminApi = await superAdmin.apis.gamdomApi;

		const { periodIdentifiers } =
			await superAdminApi.getEvReportPeriodIdentifiers(rewardType);

		expect(
			periodIdentifiers.length,
			"Expected at least one period identifier to exist",
		).toBeGreaterThan(0);

		await superAdminApi.bulkReward(
			{
				rewardType: RewardType.EV_REWARD,
				rewards: [
					{ rewardCoins: predefined.evRewards.rewardAmountCoins },
				],
				periodIdentifier: periodIdentifiers[0],
				overrideKey: null,
				startDate: null,
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
