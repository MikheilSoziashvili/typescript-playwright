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

	@step()
	async isSpecialOfferActivateButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferActivateNowButton,
		).toBeDisabled({
			timeout: Timeout.EXTRA_LONG, // To be removed when issues with e2e environment are resolved
		});
	}

	@step()
	async isSpecialOfferPromotionInProgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeVisible();
	}

	@step()
	async isSpecialOfferPromotionNotInPrgress(): Promise<void> {
		await expect(
			this.gamdomPage.map.specialOfferInProgressButton,
		).toBeHidden();
	}

	@step()
	async isInstantRakebackLockedButtonVisibile(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeVisible();
	}

	@step()
	async isInstantRakebackLockedButtonDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.instantRakebackLockedButton,
		).toBeDisabled();
	}

	@step()
	async isInstantRakebackAmountVisible(
		amount: number,
		currency?: string,
	): Promise<void> {
		const amountCurrency = currency ?? DEFAULT_CURRENCY;
		await expect(this.gamdomPage.map.instantRakebackAmount).toHaveText(
			`${amountCurrency}${parseToFloat(amount)}`,
		);
	}

	@step()
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

	@step()
	async isRoyaltyUpRewardsInProgress(
		rewardInProgress: RewardsRoyaltyUpRanks,
	): Promise<void> {
		await this.gamdomPage.map.royaltyUpBlock.scrollIntoViewIfNeeded();
		await this.checkElementsAreVisible([
			this.gamdomPage.map.royaltyUpInProgressItem(rewardInProgress),
		]);
	}

	@step()
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
			).toHaveText(`Claim $${expectedRewardValue}`);
		}
	}
}
