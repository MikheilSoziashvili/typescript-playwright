import { BaseAsserter } from "@base/base-asserter";
import { DEFAULT_CURRENCY } from "@constants/defaults";
import {
	buildAmountWithCurrency,
	formatCurrencyWithSuffix,
	parseToFloat,
} from "@core/utils/utils";
import { RewardType } from "@enums/admin/reward-type";
import { OriginalGame } from "@enums/original-games";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { Timeout } from "@enums/timeout";
import { calculateInstantReward } from "@formulas/instant-reward";
import { calculateRakeback } from "@formulas/rakeback";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { RewardsRoyaltyUpRanksValues } from "../../constants/rewards-royalty-up-rank-values";
import { RewardsPage } from "./rewards-page";
import { RewardCardButton } from "@enums/reward-card-buttons";
import { logger } from "@logger/logger";

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

	@step(
		"Instant rakeback reward is visible and amount matches rakeback formula",
	)
	public async instantRakebackRewardIsCorrect(
		betAmount: number,
		rakebackPercentage: number,
		houseEdge: number,
	): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.instantRakebackCard],
			Timeout.LONG,
		);
		const reward = calculateRakeback(
			betAmount,
			rakebackPercentage,
			houseEdge,
		);
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.instantRakebackAmount,
				expectedText: buildAmountWithCurrency(reward),
			},
		]);
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
			if (reward === RewardsRoyaltyUpRanks.UNRANKED) {
				logger.info(
					`${reward} reward is not claimable - skipping verification`,
				);
				continue;
			}

			const claimButton =
				this.gamdomPage.map.royaltyUpItemClaimButton(reward);

			await this.checkElementsAreEnabled([claimButton]);
			await this.checkElementsAreVisible([claimButton]);

			const key = reward
				.replace(" ", "_")
				.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;
			const expectedRewardValue = RewardsRoyaltyUpRanksValues[key];

			const formattedValue =
				formatCurrencyWithSuffix(expectedRewardValue);
			await this.checkElementsHaveText([
				{
					locator: claimButton,
					expectedText: `Claim ${formattedValue}`,
				},
			]);
		}
	}

	@step("Verify royalty up rewards claimable state")
	async verifyRoyaltyUpRewardsClaimableState(
		claimableRewards: RewardsRoyaltyUpRanks[],
		claimable: boolean,
	): Promise<void> {
		if (claimableRewards.length === 0) {
			const rewardType = claimable ? "claimable" : "unclaimable";
			logger.info(`No ${rewardType} rewards to verify`);
			return;
		}

		await this.gamdomPage.map.royaltyUpBlock.scrollIntoViewIfNeeded();

		for (const reward of claimableRewards) {
			if (reward === RewardsRoyaltyUpRanks.UNRANKED) {
				logger.info(
					`${reward} reward is not claimable - skipping verification`,
				);
				continue;
			}

			const claimButton =
				this.gamdomPage.map.royaltyUpItemClaimButton(reward);

			if (claimable) {
				await this.checkElementsAreEnabled([claimButton]);
				logger.info(`Reward ${reward} is claimable (button enabled)`);
			} else {
				await this.checkElementsAreDisabled([claimButton]);
				logger.info(
					`Reward ${reward} is not claimable (button disabled)`,
				);
			}

			await this.checkElementsAreVisible([claimButton]);
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

	@step("Reward is not visible")
	async rewardIsNotVisible(reward: string): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.rewardCard(reward),
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

	@step("Verify reward claimability")
	async verifyRewardClaimability(
		reward: string,
		shouldBeClaimable: boolean,
		buttonText?: string,
		rewardValue?: string,
	): Promise<void> {
		if (shouldBeClaimable) {
			await this.checkElementsAreDefined([
				{
					value: buttonText,
					message:
						"buttonText is required when shouldBeClaimable is true",
				},
				{
					value: rewardValue,
					message:
						"rewardValue is required when shouldBeClaimable is true",
				},
			]);

			await this.rewardCanBeClaimed(
				reward,
				buttonText ?? "",
				rewardValue ?? "",
			);
		} else {
			await this.rewardIsNotVisible(reward);
		}
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

	@step("Claimed {currentClaims} out of {totalClaims} special offer rewards")
	async specialOfferClaimedRewardsOutOfTotal(
		currentClaims: number,
		totalClaims: number,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.specialOfferClaimedOutOfTotal(
				currentClaims,
				totalClaims,
			),
		]);
	}

	@step("Verify all three rakeback reward cards are visible")
	async allRakebackRewardCardsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.getRewardCard(RewardType.INSTANT),
			this.gamdomPage.map.getRewardCard(RewardType.WEEKLY),
			this.gamdomPage.map.getRewardCard(RewardType.MONTHLY),
		]);
	}

	@step("Verify promo banners slider is not visible")
	async promoBannersSliderIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.promoBannersSlider,
		]);
	}

	@step("Verify special reward card details are correct")
	async verifySpecialRewardCard(
		gameName: string,
		freeSpins: number,
	): Promise<void> {
		const card = this.gamdomPage.map.rewardCard(gameName);

		await this.checkElementsAreVisible([
			card,
			card.getByText(gameName),
			card.getByText(`${freeSpins}x free spin`, { exact: false }),
			this.gamdomPage.map.rewardCardButton(
				gameName,
				RewardCardButton.GO_TO_GAME,
			),
		]);
	}

	@step("Verify number of free spin cards for a given game")
	async verifyFreeSpinCardsCount(
		gameName: string,
		freeSpins: number,
		expectedMaxCount: number,
	): Promise<void> {
		const cards = this.gamdomPage.map.rewardCard(gameName);

		await expect(async () => {
			const count = await cards.count();

			expect(
				count,
				`Expected between 1 and ${expectedMaxCount} cards for ${gameName}, but found ${count}`,
			).toBeGreaterThan(0);

			expect(
				count,
				`Too many reward cards for ${gameName}: found ${count}, max allowed is ${expectedMaxCount}`,
			).toBeLessThanOrEqual(expectedMaxCount);
		}).toPass({ timeout: Timeout.MEDIUM });

		logger.info(
			`Found ${await cards.count()} free spin card(s) for ${gameName}`,
		);

		for (let i = 0; i < (await cards.count()); i++) {
			const card = cards.nth(i);
			await expect(card).toBeVisible();
			await this.checkElementsAreVisible([
				card,
				card.getByText(`${freeSpins}x free spin`, { exact: false }),
				card.getByText(gameName, { exact: false }),
			]);
		}
	}
}
