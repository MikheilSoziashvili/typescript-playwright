import { BasePageStep } from "../../core/helpers/base-page-step";
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

	public async claimInstantRakebackReward(
		expectedAmount: string,
		currency?: string,
	): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackAmountVisible(expectedAmount, currency);
		await this.gamdomPage.clickInstantRakebackClaimRewardButton();
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackLockedButtonVisibile();
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackLockedButtonDisabled();
		await this.gamdomPage
			.assertThat()
			.isInstantRakebackAmountVisible("0.00", currency);
	}
}
