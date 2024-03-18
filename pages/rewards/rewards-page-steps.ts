import { BasePageStep } from "../../core/helpers/base-page-step";
import { RewardsPage } from "./rewards-page";

export class RewardsPageSteps extends BasePageStep<RewardsPage> {
	public constructor(gamdomPage: RewardsPage) {
		super(gamdomPage);
	}

	public async claimCode(code: string): Promise<void> {
		await this.gamdomPage.clickActivateNowButton();
		await this.gamdomPage.promoCodeModal.claimCode(code);
		await this.gamdomPage.assertThat().isClaimedBadgeVisible();
		await this.gamdomPage.assertThat().isPromotionInProgress();
	}
}
