import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { logger } from "@logger/logger";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect, Locator } from "@playwright/test";
import { parseCurrencyToNumber } from "@core/utils/utils";
import { step } from "decorators/step";
import { RewardsPage } from "./rewards-page";
import { RewardType } from "@enums/admin/reward-type";

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

	@step("Claim royalty up rewards")
	public async claimClaimableRoyaltyUpRewards(
		claimRewards: RewardsRoyaltyUpRanks[],
	): Promise<void> {
		for (const reward of claimRewards) {
			await this.claimSingleReward(reward);
		}
	}

	@step("Claim single reward")
	public async claimSingleReward(
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		if (reward === RewardsRoyaltyUpRanks.UNRANKED) {
			logger.info("UNRANKED reward is not claimable");
			return;
		}

		await this.gamdomPage.navigateToRewardInSlider(reward);

		const claimButton =
			this.gamdomPage.map.royaltyUpRewardsItemClaimButton(reward);

		await this.claimReward(claimButton, reward);
	}

	@step("Get reward amount")
	public async getRewardAmount(
		rewardType: RewardType.WEEKLY | RewardType.MONTHLY,
	): Promise<number> {
		await expect(
			this.gamdomPage.map.getRewardAmount(rewardType),
			`${rewardType} reward amount is not displayed`,
		).toBeVisible();
		const amount =
			(await this.gamdomPage.map
				.getRewardAmount(rewardType)
				.textContent()) ?? "";
		return parseCurrencyToNumber(amount);
	}

	@step("Navigate and verify banned user rewards view")
	public async navigateAndVerifyBannedUserRewardsView(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().allRakebackRewardCardsAreVisible();
		await this.gamdomPage.assertThat().promoBannersSliderIsNotVisible();
	}

	@step("Claim reward")
	public async claimReward(
		claimButton: Locator,
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		await claimButton.click();

		await this.gamdomPage.toast.assertThat().titleIs(ToastTitle.SUCCESS);
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageContains(ToastSubTitle.SUCCESSFULLY_CLAIMED_PARTIAL);

		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([claimButton]);

		logger.info(`Successfully claimed reward ${reward}`);
	}
}
