import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { RewardStatus } from "@enums/admin/reward-status";
import { ClaimReloadRewardAndVerifyClaimsTestFlow } from "./claim-reload-reward-and-verify-claims-test-flow";
import { VerifyAndClaimReloadRewardTestFlow } from "./verify-and-claim-reload-reward-test-flow";
import { VerifyReloadRewardPresenceAndClaimsTestFlow } from "./verify-reload-reward-presence-and-claims-test-flow";
import { VerifyReloadRewardPresenceTestFlow } from "./verify-reload-reward-presence-test-flow";

export class VerifyReloadUpdateLogicTestFlow extends BaseTestFlow {
	private readonly claimReloadRewardAndVerifyClaimsTestFlow: ClaimReloadRewardAndVerifyClaimsTestFlow;
	private readonly verifyAndClaimReloadRewardTestFlow: VerifyAndClaimReloadRewardTestFlow;
	private readonly verifyReloadRewardPresenceAndClaimsTestFlow: VerifyReloadRewardPresenceAndClaimsTestFlow;
	private readonly verifyReloadRewardPresenceTestFlow: VerifyReloadRewardPresenceTestFlow;

	constructor() {
		super();
		this.claimReloadRewardAndVerifyClaimsTestFlow =
			new ClaimReloadRewardAndVerifyClaimsTestFlow();
		this.verifyAndClaimReloadRewardTestFlow =
			new VerifyAndClaimReloadRewardTestFlow();
		this.verifyReloadRewardPresenceAndClaimsTestFlow =
			new VerifyReloadRewardPresenceAndClaimsTestFlow();
		this.verifyReloadRewardPresenceTestFlow =
			new VerifyReloadRewardPresenceTestFlow();
	}

	@testFlow("Verify reload update logic - claim reward and verify in admin")
	public async verifyReloadUpdateLogic(params: {
		user: BrowserUserSession;
		adminUser: BrowserUserSession;
		rewardAmount: string;
		expectedBalanceIncrease: number;
		expectedClaimedDays: number;
		totalDays: number;
	}): Promise<void> {
		const {
			user,
			adminUser,
			rewardAmount,
			expectedBalanceIncrease,
			expectedClaimedDays,
			totalDays,
		} = params;

		const targetUsername = user.getAuthenticatedUser().user.username;

		if (expectedClaimedDays > 0) {
			await this.claimReloadRewardAndVerifyClaimsTestFlow.claimReloadRewardAndVerifyClaims(
				{
					user,
					rewardAmount,
					expectedBalanceIncrease,
					expectedClaimedDays,
					totalDays,
				},
			);

			await this.verifyReloadRewardPresenceAndClaimsTestFlow.verifyReloadRewardPresenceAndClaims(
				{
					adminUser,
					targetUsername,
					expectedClaimedDays,
					totalDays,
				},
			);
		} else {
			await this.verifyAndClaimReloadRewardTestFlow.verifyAndClaimReloadReward(
				{
					user: user,
					rewardAmount: rewardAmount,
					expectedBalanceIncrease: expectedBalanceIncrease,
					totalDays: totalDays,
				},
			);

			await this.verifyReloadRewardPresenceTestFlow.verifyReloadRewardIsAbsent(
				{
					adminUser: adminUser,
					targetUsername: targetUsername,
					section: RewardStatus.ACTIVE,
				},
			);
		}
	}
}
