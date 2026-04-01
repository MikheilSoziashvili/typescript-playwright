import { BrowserUserSession } from "@core/browser-session-mngmt";
import { RewardType } from "@enums/admin/reward-type";
import { BaseTestFlow, testFlow } from "@test-flows";
import { EvRewardsBulkRewardSetupTestFlow } from "./ev-rewards-bulk-reward-setup-test-flow";
import { EvRewardsClaimRewardVerificationTestFlow } from "./ev-rewards-claim-reward-verification-test-flow";

export class EvRewardsBulkRewardScenarioTestFlow extends BaseTestFlow {
	constructor(
		private readonly setupFlow: EvRewardsBulkRewardSetupTestFlow,
		private readonly verificationFlow: EvRewardsClaimRewardVerificationTestFlow,
	) {
		super();
	}

	@testFlow("Setup bulk reward for user")
	public async setupBulkReward(
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY,
	): Promise<BrowserUserSession> {
		return this.setupFlow.setupBulkReward(rewardType);
	}

	@testFlow("Verify and claim EV reward")
	public async verifyAndClaimReward(params: {
		regularUser: BrowserUserSession;
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY;
	}): Promise<void> {
		await this.verificationFlow.verifyAndClaimReward(params);
	}

	@testFlow("Execute bulk reward with missing userId expecting error")
	public async executeBulkRewardWithMissingUserId(
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY,
	): Promise<void> {
		await this.setupFlow.callBulkRewardWithMissingUserId(rewardType);
	}
}
