import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { ClaimReloadRewardTestFlow } from "./claim-reload-reward-test-flow";

export class VerifyAndClaimReloadRewardTestFlow extends BaseTestFlow {
	private readonly claimReloadRewardTestFlow: ClaimReloadRewardTestFlow;

	constructor() {
		super();
		this.claimReloadRewardTestFlow = new ClaimReloadRewardTestFlow();
	}

	@testFlow(
		"Verify reload reward claimability and claims, then claim and verify balance",
	)
	public async verifyAndClaimReloadReward(params: {
		user: BrowserUserSession;
		rewardAmount: string;
		expectedBalanceIncrease: number;
		totalDays: number;
	}): Promise<void> {
		const { user, rewardAmount, expectedBalanceIncrease, totalDays } =
			params;

		await user.pages.rewardsPage.navigate();
		await user.pages.rewardsPage
			.assertThat()
			.verifyRewardClaimability(
				CustomRewardType.RELOAD,
				true,
				RewardButton.CLAIM,
				rewardAmount,
			);

		await user.pages.rewardsPage
			.assertThat()
			.specialOfferClaimedRewardsOutOfTotal(0, totalDays);

		await this.claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance({
			user: user,
			rewardAmount: rewardAmount,
			expectedBalanceIncrease: expectedBalanceIncrease,
			expectedRewardMissing: true,
		});
	}
}
