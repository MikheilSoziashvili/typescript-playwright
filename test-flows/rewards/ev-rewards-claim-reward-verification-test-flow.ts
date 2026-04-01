import { BrowserUserSession } from "@core/browser-session-mngmt";
import { roundToDecimals } from "@core/utils/utils";
import { RewardType } from "@enums/admin/reward-type";
import { expect } from "@playwright/test";
import { BaseTestFlow, testFlow } from "@test-flows";
import { predefined } from "test-data/sources/predefined";

export class EvRewardsClaimRewardVerificationTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Verify: Navigate to rewards and claim EV reward")
	public async verifyAndClaimReward(params: {
		regularUser: BrowserUserSession;
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY;
	}): Promise<void> {
		const { regularUser, rewardType } = params;
		const rewardsPage = regularUser.pages.rewardsPage;

		await regularUser.pages.homePage.navigate();
		await rewardsPage.navigate();
		await rewardsPage.assertThat().rewardIsVisibleAndAvailable(rewardType);

		const balanceBefore =
			await rewardsPage.authenticatedHeader.getAccountBalance();
		const rewardAmount = await rewardsPage
			.steps()
			.getRewardAmount(rewardType);
		expect(rewardAmount).toBe(predefined.evRewards.rewardAmount);

		await rewardsPage.claimReward(rewardType);
		await rewardsPage.assertThat().rewardIsClaimedAndDisabled(rewardType);
		await rewardsPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(roundToDecimals(balanceBefore + rewardAmount, 2));
	}
}
