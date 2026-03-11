import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { RewardStatus } from "@enums/admin/reward-status";
import { VerifyReloadRewardPresenceTestFlow } from "./verify-reload-reward-presence-test-flow";

export class VerifyReloadRewardPresenceAndClaimsTestFlow extends BaseTestFlow {
	private readonly verifyReloadRewardPresenceTestFlow: VerifyReloadRewardPresenceTestFlow;

	constructor() {
		super();
		this.verifyReloadRewardPresenceTestFlow =
			new VerifyReloadRewardPresenceTestFlow();
	}

	@testFlow(
		"Verify reload reward is present in admin and claims match expected",
	)
	public async verifyReloadRewardPresenceAndClaims(params: {
		adminUser: BrowserUserSession;
		targetUsername: string;
		expectedClaimedDays: number;
		totalDays: number;
	}): Promise<void> {
		const { adminUser, targetUsername, expectedClaimedDays, totalDays } =
			params;

		await this.verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsPresent(
			{
				adminUser: adminUser,
				targetUsername: targetUsername,
				section: RewardStatus.ACTIVE,
			},
		);

		await adminUser.pages.userInfoRewardsAdminPage
			.assertThat()
			.claimedRewardsOutOfTotal(expectedClaimedDays, totalDays);
	}
}
