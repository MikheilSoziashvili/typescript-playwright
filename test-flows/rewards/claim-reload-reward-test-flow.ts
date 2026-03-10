import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";

export class ClaimReloadRewardTestFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Claim reload reward and verify balance")
	public async claimReloadRewardAndVerifyBalance(params: {
		user: BrowserUserSession;
		rewardAmount: string;
		expectedBalanceIncrease: number;
		expectedRewardMissing?: boolean;
	}): Promise<void> {
		const {
			user,
			rewardAmount,
			expectedBalanceIncrease,
			expectedRewardMissing = true,
		} = params;

		const userBalanceHandler = await user.userBalanceHandler();

		const initialBalance =
			await userBalanceHandler.walletBalanceInFiatRounded();

		await user.pages.rewardsPage.navigate();

		await user.pages.rewardsPage
			.assertThat()
			.rewardCanBeClaimed(
				CustomRewardType.RELOAD,
				RewardButton.CLAIM,
				rewardAmount,
			);

		await user.pages.rewardsPage.clickOnRewardButton(
			CustomRewardType.RELOAD,
			RewardButton.CLAIM,
		);

		if (expectedRewardMissing) {
			await user.pages.rewardsPage
				.assertThat()
				.rewardIsNotVisible(CustomRewardType.RELOAD);
		}

		const expectedBalance = initialBalance + expectedBalanceIncrease;

		await user.pages.homePage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
	}
}
