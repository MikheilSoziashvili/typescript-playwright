import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { RewardsPage } from "./rewards-page";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { logger } from "@logger/logger";
import { Locator } from "@playwright/test";

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

	@step("Claim claimable royalty up rewards and verify balance")
	public async claimClaimableRoyaltyUpRewards(
		claimRewards: RewardsRoyaltyUpRanks[],
		unrankedBonusAmount = 48,
	): Promise<void> {
		const claimableRewards = claimRewards.filter(
			(r) => r !== RewardsRoyaltyUpRanks.UNRANKED,
		);
		const hasUnrankedBonus = claimRewards.includes(
			RewardsRoyaltyUpRanks.UNRANKED,
		);

		for (const [index, reward] of claimableRewards.entries()) {
			const includeUnrankedBonus = hasUnrankedBonus && index === 0;
			await this.claimSingleReward(
				reward,
				includeUnrankedBonus,
				unrankedBonusAmount,
			);
		}
	}

	@step("Claim single reward and verify balance")
	public async claimSingleReward(
		reward: RewardsRoyaltyUpRanks,
		includeUnrankedBonus = false,
		unrankedBonusAmount = 48,
	): Promise<void> {
		await this.gamdomPage.navigateToRewardInSlider(reward);

		const claimButton =
			this.gamdomPage.map.royaltyUpRewardsItemButton(reward);

		const extractedAmount = await this.gamdomPage.extractRewardAmount(
			claimButton,
			reward,
		);

		const totalAmount = includeUnrankedBonus
			? extractedAmount + unrankedBonusAmount
			: extractedAmount;

		if (includeUnrankedBonus) {
			logger.info(
				`Adding Unranked bonus of $${unrankedBonusAmount} to ${reward} reward`,
			);
		}

		await this.claimRewardAndVerifyBalance(
			claimButton,
			reward,
			totalAmount,
		);
	}

	@step("Claim reward and verify balance")
	public async claimRewardAndVerifyBalance(
		claimButton: Locator,
		reward: RewardsRoyaltyUpRanks,
		expectedAmount: number,
	): Promise<void> {
		const accountBalanceInitial =
			await this.userBalanceHandler.walletBalanceInFiatRounded();

		await claimButton.click();

		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([claimButton]);

		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalanceInitial + expectedAmount);

		logger.info(
			`Successfully claimed reward ${reward}, balance updated by $${expectedAmount}`,
		);
	}
}
