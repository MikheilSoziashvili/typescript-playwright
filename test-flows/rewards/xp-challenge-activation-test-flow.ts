import { BaseTestFlow, testFlow } from "@test-flows";
import { BrowserUserSession } from "@core/browser-session-mngmt";
import { CustomRewardType } from "@enums/admin/custom-reward-type";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { RewardButton } from "@enums/admin/rewards";

export class XpChallengeActivationFlow extends BaseTestFlow {
	constructor() {
		super();
	}

	@testFlow("Activate XP Challenge reward")
	public async activateXpChallenge(params: {
		user: BrowserUserSession;
	}): Promise<void> {
		const { user } = params;

		await user.pages.rewardsPage.navigate();

		await user.pages.rewardsPage
			.assertThat()
			.rewardIsVisibleAndCanBeActivated(
				CustomRewardType.XP_CHALLENGE_LABEL,
				RewardButton.ACTIVATE,
			);

		await user.pages.rewardsPage.clickOnRewardButton(
			CustomRewardType.XP_CHALLENGE_LABEL,
			RewardButton.ACTIVATE,
		);

		await user.pages.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.XP_CHALLENGE_ACTIVATED,
			);
	}
}
