import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { RewardsPage } from "./rewards-page";
import { DEFAULT_CURRENCY } from "@constants/defaults";
import { parseToFloat } from "@core/utils/utils";
import { Timeout } from "@enums/timeout";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { step } from "decorators/step";
import { RewardsRoyaltyUpRanksValues } from "../../constants/rewards-royalty-up-rank-values";
import { OriginalGame } from "@enums/original-games";
import { calculateInstantReward } from "@formulas/instant-reward";
import { RewardType } from "@enums/admin/reward-type";

export class RewardsPageAsserter extends BaseAsserter<RewardsPage> {
	public constructor(page: RewardsPage) {
		super(page);
	}

	@step("Verify 'Rewards' and 'Royalty Up' blocks are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.rewardsBlock,
				this.gamdomPage.map.royaltyUpBlock,
			],
			Timeout.MAX,
		);
	}

	@step("Is special offer activate button disabled")
	async isSpecialOfferActivateButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferActivateNowButton,
		).toBeDisabled({
			timeout: Timeout.EXTRA_LONG, // To be removed when issues with e2e environment are resolved
		});
	}

	@step("Is special offer promotion in progress")
	async isSpecialOfferPromotionInProgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeVisible();
	}

	@step("Is special offer promotion not in prgress")
	async isSpecialOfferPromotionNotInPrgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeHidden();
	}

	@step("Is instant rakeback locked button visibile")
	async isInstantRakebackLockedButtonVisibile(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeVisible();
	}

	@step("Is instant rakeback locked button disabled")
	async isInstantRakebackLockedButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeDisabled();
	}

	@step("Is instant rakeback amount visible")
	async isInstantRakebackAmountVisible(
		amount: number,
		currency?: string,
	): Promise<void> {
		const amountCurrency = currency ?? DEFAULT_CURRENCY;
		await expect(this.gamdomPage.map.instantRakebackAmount).toHaveText(
			`${amountCurrency}${parseToFloat(amount)}`,
		);
	}

	@step("Is instant reward visible")
	async isInstantRewardVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.instantRakebackCard],
			Timeout.MEDIUM,
		);
	}

	@step(
		"Verify instant reward calculation based on house edge and bet amount",
	)
	public async verifyInstantRewardAmountIsCalculated(
		game: OriginalGame,
		betAmount: number,
	): Promise<void> {
		const reward = calculateInstantReward(game, betAmount);
		const formattedReward = `$${reward.toFixed(2)}`;
		await expect(this.gamdomPage.map.instantRakebackAmount).toHaveText(
			formattedReward,
		);
	}

	@step("Instant reward is claimable and calculated based on formula")
	public async instantRewardVisibleAndCalculated(
		game: OriginalGame,
		betAmount: number,
	): Promise<void> {
		await this.gamdomPage.assertThat().isInstantRewardVisible();
		await this.gamdomPage
			.assertThat()
			.verifyInstantRewardAmountIsCalculated(game, betAmount);
	}

	@step("Is royalty up rewards in progress")
	async isRoyaltyUpRewardsInProgress(
		rewardInProgress: RewardsRoyaltyUpRanks,
	): Promise<void> {
		await this.gamdomPage.map.royaltyUpBlock.scrollIntoViewIfNeeded();
		await this.checkElementsAreVisible([
			this.gamdomPage.map.royaltyUpInProgressItem(rewardInProgress),
		]);
	}

	@step("Is royalty up rewards claimable")
	async isRoyaltyUpRewardsClaimable(
		claimableRewards: RewardsRoyaltyUpRanks[],
	): Promise<void> {
		await this.gamdomPage.map.royaltyUpBlock.scrollIntoViewIfNeeded();

		for (const reward of claimableRewards) {
			await expect(
				this.gamdomPage.map.royaltyUpItemClaimButton(reward),
			).toBeEnabled();
			await expect(
				this.gamdomPage.map.royaltyUpItemClaimButton(reward),
			).toBeVisible();

			const key = reward
				.replace(" ", "_")
				.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;
			const expectedRewardValue = RewardsRoyaltyUpRanksValues[key];
			await expect(
				this.gamdomPage.map.royaltyUpItemClaimButton(reward),
			).toHaveText(`Claim $${expectedRewardValue.toFixed(2)}`);
		}
	}

	@step("Reward is visible and can be activated")
	async rewardIsVisibleAndCanBeActivated(
		reward: string,
		buttonText: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rewardCard(reward),
			this.gamdomPage.map.rewardCardButton(reward, buttonText),
		]);
	}

	@step("Reward can be claimed")
	async rewardCanBeClaimed(
		reward: string,
		buttonText: string,
		rewardValue: string,
	): Promise<void> {
		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.rewardCard(reward),
				expectedText: rewardValue,
			},
		]);
	}

	@step("Reward is claimed and active")
	async rewardIsClaimedAndActive(
		reward: string,
		buttonText: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rewardCardButton(reward, buttonText),
		]);
	}

	@step("Instant and royalty up rewards are available")
	async instantAndRoyaltyUpRewardsAreAvailable(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.getRewardAmount(RewardType.INSTANT),
			this.gamdomPage.map.getRewardClaimButton(RewardType.INSTANT),
			this.gamdomPage.map.royaltyUpClaimButton,
		]);
	}

	@step("Weekly reward is visible and can be activated")
	async weeklyRewardIsVisibleAndAvailable(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.rewardsOffersList,
			this.gamdomPage.map.getRewardAmount(RewardType.WEEKLY),
			this.gamdomPage.map.getRewardClaimButton(RewardType.WEEKLY),
		]);
	}

	@step("Monthly reward is visible and can be activated")
	async monthlyRewardIsVisibleAndAvailable(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.getRewardAmount(RewardType.MONTHLY),
			this.gamdomPage.map.getRewardClaimButton(RewardType.MONTHLY),
		]);
	}
}
