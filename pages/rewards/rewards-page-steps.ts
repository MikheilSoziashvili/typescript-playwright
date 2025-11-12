import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { RewardsPage } from "./rewards-page";

export class RewardsPageSteps extends BasePageStep<RewardsPage> {
	public constructor(gamdomPage: RewardsPage) {
		super(gamdomPage);
	}

	@step("Claim instant reward and verify balance")
	public async claimInstantRewardAndVerifyBalance(
		expectedBalance: number,
	): Promise<void> {
		await this.gamdomPage.clickInstantRakebackClaimRewardButton();
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(expectedBalance);
	}

	@step("Claim code")
	public async claimCode(code: string): Promise<void> {
		await this.gamdomPage.clickActivateNowButton();
		await this.gamdomPage.welcomeBonusModal.claimCode(code);
		await this.gamdomPage
			.assertThat()
			.isSpecialOfferActivateButtonDisabled();
	}

	@step("Click a specific reward card's button by index")
	public async clickRewardCardButtonByIndex(
		reward: string,
		buttonText: string,
		index: number,
	): Promise<void> {
		const button = this.gamdomPage.map
			.rewardCardButton(reward, buttonText)
			.nth(index);
		await button.scrollIntoViewIfNeeded();
		await button.click();
	}
}
