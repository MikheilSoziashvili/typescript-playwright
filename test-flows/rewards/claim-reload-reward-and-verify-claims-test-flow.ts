import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { ClaimReloadRewardTestFlow } from "./claim-reload-reward-test-flow";

export class ClaimReloadRewardAndVerifyClaimsTestFlow extends BaseTestFlow {
	private readonly claimReloadRewardTestFlow: ClaimReloadRewardTestFlow;

	constructor() {
		super();
		this.claimReloadRewardTestFlow = new ClaimReloadRewardTestFlow();
	}

	@testFlow("Claim reload reward and verify claimed rewards out of total")
	public async claimReloadRewardAndVerifyClaims(params: {
		user: BrowserUserSession;
		rewardAmount: string;
		expectedBalanceIncrease: number;
		expectedClaimedDays: number;
		totalDays: number;
	}): Promise<void> {
		const {
			user,
			rewardAmount,
			expectedBalanceIncrease,
			expectedClaimedDays,
			totalDays,
		} = params;

		await user.pages.rewardsPage.navigate();
		await user.pages.rewardsPage
			.assertThat()
			.verifyRewardClaimability(
				CustomRewardType.RELOAD,
				true,
				RewardButton.CLAIM,
				rewardAmount,
			);

		await this.claimReloadRewardTestFlow.claimReloadRewardAndVerifyBalance({
			user: user,
			rewardAmount: rewardAmount,
			expectedBalanceIncrease: expectedBalanceIncrease,
			expectedRewardMissing: false,
		});

		await user.pages.rewardsPage
			.assertThat()
			.rewardIsClaimedAndActive(
				CustomRewardType.RELOAD,
				RewardButton.AVAILABLE_IN,
			);

		await user.pages.rewardsPage
			.assertThat()
			.specialOfferClaimedRewardsOutOfTotal(
				expectedClaimedDays,
				totalDays,
			);
	}
}
