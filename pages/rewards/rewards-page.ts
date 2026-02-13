import { BasePage } from "@base/base-page";
import { REWARDS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { RewardsRoyaltyUpRanksValues } from "@constants/rewards-royalty-up-rank-values";
import { SPECIAL_OFFER_RATEBACK } from "@constants/specialoffers";
import { buildClaimedAmountSubTitle } from "@core/helpers/asserter-helpers/text-asserters";
import { BasePageNavigationParametersType } from "@core/types/types";
import { parseShortScaledCurrency, waitForSeconds } from "@core/utils/utils";
import { RatebackHouseEdge } from "@enums/rateback-house-edge-options";
import { RewardsRoyaltyUpRanks } from "@enums/rewards-royalty-up-ranks";
import { Timeout } from "@enums/timeout";
import { calculateRakeback } from "@formulas/rakeback";
import { WelcomeBonusModal } from "@pages/modals/welcome-bonus-modal/welcome-bonus-modal";
import { Toast } from "@pages/components/toast/toast";
import { Locator, Page, expect } from "@playwright/test";
import { step } from "decorators/step";
import { RewardsPageAsserter } from "./rewards-page-asserter";
import { RewardsPageMap } from "./rewards-page-map";
import { RewardsPageSteps } from "./rewards-page-steps";
import { RewardType } from "@enums/admin/reward-type";
import { logger } from "@logger/logger";
import {
	numericAmountPattern,
	shortScaledAmountPattern,
} from "@support/regex-patterns";
import {
	BRONZE_EDGE_RANKS,
	CLAIMABLE_ROYALTY_UP_RANKS,
	OPAL_EDGE_RANKS,
} from "@constants/rewards-royalty-up-rank-groups";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";

export class RewardsPage extends BasePage<RewardsPageMap> {
	public constructor(page: Page) {
		super(page, new RewardsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [REWARDS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): RewardsPageAsserter {
		return new RewardsPageAsserter(this);
	}

	public steps(): RewardsPageSteps {
		return new RewardsPageSteps(this);
	}

	public get welcomeBonusModal(): WelcomeBonusModal {
		return new WelcomeBonusModal(this.page);
	}

	@step("Click activate now button")
	public async clickActivateNowButton(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.specialOfferActivateNowButton,
			timeout: Timeout.EXTRA_MAX, // To be removed when issues with e2e environment are resolved
		});
		await this.map.specialOfferActivateNowButton.click();
	}

	@step("Click instant rakeback claim reward button")
	public async clickInstantRakebackClaimRewardButton(): Promise<void> {
		await this.map.instantRakebackClaimRewardButton.click();
	}

	@step("Get rakeback amount")
	public async getRakebackAmount(): Promise<string> {
		const amount = await this.map.instantRakebackAmount.textContent();
		if (amount) {
			return amount;
		} else {
			throw new Error("Amount not displayed!");
		}
	}

	@step("Calculate rakeback amount")
	public async calculateRakebackAmount(parameters: {
		wager: number;
		rateback: number;
		houseEdge: RatebackHouseEdge;
	}): Promise<number> {
		const { wager, rateback, houseEdge } = parameters;
		let ratebackAmount: number;
		if (await this.map.specialOfferInProgressButton.isVisible()) {
			ratebackAmount = calculateRakeback(
				wager,
				SPECIAL_OFFER_RATEBACK,
				houseEdge,
			);
		} else {
			ratebackAmount = calculateRakeback(wager, rateback, houseEdge);
		}

		return ratebackAmount;
	}
	@step("Claim royalty up reward")
	async claimRoyaltyUpReward(
		claimRewards: RewardsRoyaltyUpRanks[],
		options?: {
			includePreviousRankReward?: boolean;
			previousRank?: RewardsRoyaltyUpRanks;
		},
	): Promise<void> {
		for (const reward of claimRewards) {
			if (
				reward === RewardsRoyaltyUpRanks.UNRANKED &&
				!(options?.includePreviousRankReward && options.previousRank)
			) {
				logger.info("UNRANKED reward is not claimable");
				continue;
			}

			const rewardKey = reward
				.replace(" ", "_")
				.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;

			let expectedRewardValue = RewardsRoyaltyUpRanksValues[rewardKey];

			if (options?.includePreviousRankReward && options.previousRank) {
				const previousRankKey = options.previousRank
					.replace(" ", "_")
					.toUpperCase() as keyof typeof RewardsRoyaltyUpRanksValues;

				const previousRankValue =
					RewardsRoyaltyUpRanksValues[previousRankKey];

				logger.info(
					`Including previous rank '${options.previousRank}' reward: $${previousRankValue}`,
				);
				expectedRewardValue += previousRankValue;
			}

			await this.map
				.royaltyUpRewardsItem(reward)
				.scrollIntoViewIfNeeded();

			const accountBalanceInitial =
				await this.authenticatedHeader.getAccountBalance();

			await this.map.royaltyUpItemClaimButton(reward).click();

			const toast = new Toast(this.page);
			await toast.assertThat().isDisplayed();
			await toast
				.assertThat()
				.subTitleIs(buildClaimedAmountSubTitle(expectedRewardValue));
			await expect(
				this.map.royaltyUpItemClaimButton(reward),
			).toBeDisabled();

			await this.authenticatedHeader
				.assertThat()
				.accountBalanceIs(accountBalanceInitial + expectedRewardValue);
		}
	}

	@step("Click Activate button for reward")
	async clickOnRewardButton(
		reward: string,
		buttonText: string,
	): Promise<void> {
		await this.map.rewardCardButton(reward, buttonText).click();
	}

	@step("Claim royalty up reward")
	async claimSingleRoyaltyUpReward(): Promise<void> {
		await this.map.royaltyUpClaimButton.click();
	}

	@step("Claim reward")
	async claimReward(rewardType: RewardType): Promise<void> {
		await this.map.getRewardClaimButton(rewardType).click();
	}

	@step("Click a specific reward card's button by index")
	public async clickRewardCardButtonByIndex(
		reward: string,
		buttonText: string,
		index: number,
	): Promise<void> {
		const button = this.map.rewardCardButton(reward, buttonText).nth(index);
		await button.scrollIntoViewIfNeeded();
		await button.click();
	}

	@step("Extract reward amount from claim button text")
	public async extractRewardAmount(
		claimButton: Locator,
		reward: RewardsRoyaltyUpRanks,
	): Promise<number> {
		await this.assertThat().checkElementsAreEnabled([claimButton]);

		const buttonText = (await claimButton.textContent()) || "";

		const amountMatch =
			buttonText.match(shortScaledAmountPattern) ??
			buttonText.match(numericAmountPattern);

		expect(
			amountMatch,
			`Could not extract amount from button text: ${buttonText}`,
		).not.toBeNull();

		const extractedAmount = parseShortScaledCurrency(
			amountMatch?.[0] ?? "",
		);

		logger.info(
			`Claiming reward ${reward} with amount: $${extractedAmount}`,
		);

		return extractedAmount;
	}

	@step("Navigate to reward in slider")
	public async navigateToRewardInSlider(
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		const isBronzeEdge = BRONZE_EDGE_RANKS.includes(reward);
		const isOpalEdge = OPAL_EDGE_RANKS.includes(reward);
		await this.map.royaltyUpBlock.scrollIntoViewIfNeeded();

		if (isBronzeEdge) {
			logger.info(
				`${reward} is a Bronze edge rank, attempting to make it clickable`,
			);
			await this.navigateToBronzeEdgeRank(reward);
			return;
		}

		if (isOpalEdge) {
			logger.info(
				`${reward} is an Opal edge rank, attempting to make it clickable`,
			);
			await this.navigateToOpalEdgeRank(reward);
			return;
		}

		await this.navigateToNonEdgeRank(reward);
	}

	@step("Navigate to Bronze edge rank")
	private async navigateToBronzeEdgeRank(
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		await this.navigateToEdgeRank(reward, RewardsRoyaltyUpRanks.SILVER_1);
	}

	@step("Navigate to Opal edge rank")
	private async navigateToOpalEdgeRank(
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		await this.navigateToEdgeRank(reward, RewardsRoyaltyUpRanks.DIAMOND_3);
	}

	@step("Navigate to edge rank")
	private async navigateToEdgeRank(
		reward: RewardsRoyaltyUpRanks,
		fallbackRank: RewardsRoyaltyUpRanks,
	): Promise<void> {
		logger.info(
			`Attempting to navigate to ${fallbackRank} to make ${reward} visible`,
		);
		await this.navigateToNonEdgeRank(fallbackRank);

		logger.info(
			`${reward} should now be visible, navigating to it using slider buttons`,
		);
		await this.navigateToNonEdgeRank(reward);
	}

	@step("Navigate to non-edge rank")
	private async navigateToNonEdgeRank(
		reward: RewardsRoyaltyUpRanks,
	): Promise<void> {
		const maxAttempts = 30;
		const rankOrder = CLAIMABLE_ROYALTY_UP_RANKS;
		const targetRankIndex = rankOrder.indexOf(reward);
		let previousActiveRankIndex = -1;
		let stuckCount = 0;

		for (let attempts = 0; attempts < maxAttempts; attempts++) {
			logger.info(
				`Navigation attempt ${attempts + 1} for reward ${reward}`,
			);

			if (await this.isRewardCentered(reward)) {
				logger.info(`Reward ${reward} is now in the center (active)`);
				return;
			}

			const currentActiveRankIndex =
				await this.findCurrentActiveRankIndex(rankOrder);

			if (currentActiveRankIndex === previousActiveRankIndex) {
				stuckCount++;
				if (stuckCount >= 3) {
					logger.warn(
						`Slider stuck at ${rankOrder[currentActiveRankIndex]} for 3 attempts, checking if ${reward} is visible and clickable`,
					);
					const rewardButton =
						this.map.royaltyUpRewardsItemButton(reward);
					const isVisible = (await rewardButton.count()) > 0;
					if (isVisible && (await rewardButton.isEnabled())) {
						logger.info(
							`${reward} is visible and clickable even though slider is stuck, stopping navigation`,
						);
						return;
					}
					logger.warn(
						`${reward} is not visible or not clickable, stopping navigation`,
					);
					break;
				}
			} else {
				stuckCount = 0;
			}
			previousActiveRankIndex = currentActiveRankIndex;

			const direction = this.determineSliderNavigationDirection(
				targetRankIndex,
				currentActiveRankIndex,
				reward,
				rankOrder[currentActiveRankIndex],
			);

			const navigated = await this.navigateSliderInDirection(
				direction,
				this.map.royaltyUpSliderNextButton,
				this.map.royaltyUpSliderPreviousButton,
				reward,
				attempts + 1,
			);
			if (!navigated) {
				break;
			}

			await waitForSeconds(0.3);
		}

		logger.warn(
			`Could not find reward ${reward} in correct position after ${maxAttempts} attempts`,
		);
	}

	@step("Check if reward is centered")
	private async isRewardCentered(
		reward: RewardsRoyaltyUpRanks,
	): Promise<boolean> {
		const swiperSlide = this.map.royaltyUpRewardsItemSwiperSlide(reward);

		const exists = await swiperSlide.count();
		if (exists === 0) {
			logger.warn(`Reward ${reward} not found in the slider`);
			return false;
		}

		const classAttribute = await swiperSlide.getAttribute(Attributes.CLASS);
		return (
			classAttribute?.includes(AttributesValues.SWIPER_SLIDE_ACTIVE) ??
			false
		);
	}

	@step("Find current active rank index")
	private async findCurrentActiveRankIndex(
		rankOrder: RewardsRoyaltyUpRanks[],
	): Promise<number> {
		const slideLocators = rankOrder.map((rank) =>
			this.map.royaltyUpRewardsItemSwiperSlide(rank),
		);
		const activeIndex =
			await this.findCurrentActiveSlideIndex(slideLocators);

		return activeIndex;
	}
}
