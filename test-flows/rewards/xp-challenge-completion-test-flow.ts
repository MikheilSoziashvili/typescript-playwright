import { BrowserUserSession } from "@core/browser-session-mngmt";
import { buildClaimedAmountSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { roundToDecimals } from "@core/utils/utils";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { RewardButton } from "@enums/admin/rewards";
import { BaseTestFlow, testFlow } from "@test-flows";

export class XpChallengeCompletionFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Complete XP Challenge and claim reward")
	public async completeAndClaimReward(params: {
		user: BrowserUserSession;
		betAmount: number;
		rewardAmount: number;
	}): Promise<void> {
		const { user, betAmount, rewardAmount } = params;

		await user.pages.diceGamePage.navigate();
		await user.pages.diceGamePage.rollDiceWithAmount(betAmount);

		await user.pages.rewardsPage.navigate();

		const accountBalanceInitial =
			await user.pages.rewardsPage.authenticatedHeader.getAccountBalance();

		const roundedFinalBalance = roundToDecimals(
			accountBalanceInitial + rewardAmount,
			2,
		);

		await user.pages.rewardsPage.clickOnRewardButton(
			CustomRewardType.XP_CHALLENGE_USER,
			RewardButton.CLAIM,
		);

		await user.pages.toast
			.assertThat()
			.subTitleIs(buildClaimedAmountSubTitle(rewardAmount));

		await user.pages.rewardsPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(roundedFinalBalance);
	}
}
