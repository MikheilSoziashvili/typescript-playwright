import { ZERO_RAKEBACK_AMOUNT } from "@constants/specialoffers";
import { BasePageStep } from "@core/helpers/base-page-step";
import { RewardsPage } from "./rewards-page";

export class RewardsPageSteps extends BasePageStep<RewardsPage> {
	public constructor(gamdomPage: RewardsPage) {
		super(gamdomPage);
	}

	public async claimCode(code: string): Promise<void> {
		await this.gamdomPage.clickActivateNowButton();
		await this.gamdomPage.welcomeBonusModal.claimCode(code);
		await this.gamdomPage.assertThat().isSpecialOfferClaimedBadgeVisible();
		await this.gamdomPage.assertThat().isSpecialOfferPromotionInProgress();
	}

	public async claimInstantRakebackReward(options: {
		expectedAmount?: number;
		currency?: string;
		claimAnyReward?: boolean;
	}): Promise<void> {
		await this.gamdomPage.map.instantRakebackCard.waitFor({
			state: "visible",
		});
		if (options.expectedAmount) {
			await this.gamdomPage
				.assertThat()
				.isInstantRakebackAmountVisible(
					options.expectedAmount,
					options.currency,
				);
			await this.gamdomPage.clickInstantRakebackClaimRewardButton();
		}

		if (
			options.claimAnyReward === true &&
			!(await this.gamdomPage.map.instantRakebackLockedButton.isVisible())
		) {
			await this.gamdomPage.clickInstantRakebackClaimRewardButton();
		}

		await this.gamdomPage
			.assertThat()
			.isInstantRakebackLockedButtonVisibile();
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackLockedButtonDisabled();
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackAmountVisible(
				ZERO_RAKEBACK_AMOUNT,
				options.currency,
			);
	}
}
