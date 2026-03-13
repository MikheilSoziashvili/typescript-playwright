import { BaseMap } from "@base/base-map";
import { RewardType } from "@enums/admin/reward-type";
import { Locator, Page } from "@playwright/test";

export class RewardsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get rewardsBlock(): Locator {
		return this.page.getByTestId("RakeBackSlider");
	}

	public get royaltyUpBlock(): Locator {
		return this.page.getByTestId("RoyaltyUpSlider");
	}

	public get specialOffersList(): Locator {
		return this.page.getByTestId("SpecialRewardsSlider");
	}

	public get rewardsOffersList(): Locator {
		return this.page.getByTestId("RakeBackSlider");
	}

	public get rewardsSpecialOfferCard(): Locator {
		return this.specialOffersList.locator(".swiper-slide-active");
	}

	public get specialOfferActivateNowButton(): Locator {
		return this.rewardsSpecialOfferCard.getByTestId(
			"SpecialRewardCardWelcomeButton",
		);
	}

	public get specialOfferInProgressButton(): Locator {
		return this.rewardsSpecialOfferCard.getByTestId(
			"rewardsSpecialOfferInProgressButton",
		);
	}

	public get specialOfferClaimedBadge(): Locator {
		return this.rewardsSpecialOfferCard.locator("div:text-is('Claimed')");
	}

	public get instantRakebackCard(): Locator {
		return this.rewardsOffersList.getByTestId(
			"rewardsCard-instant_rakeback",
		);
	}

	public get instantRakebackClaimRewardButton(): Locator {
		return this.instantRakebackCard.locator(
			'button:has(span:text-is("Claim Reward"))',
		);
	}

	public get instantRakebackLockedButton(): Locator {
		return this.instantRakebackCard
			.getByTestId("rewardsCardBottom-instant")
			.locator('button:has-text("Locked")');
	}

	public get instantRakebackAmount(): Locator {
		return this.instantRakebackCard
			.getByTestId("rewardsAmount-instant_rakeback")
			.locator("span.currency-amount");
	}

	public royaltyUpRewardsItem(placeholderText: string): Locator {
		return this.royaltyUpBlock.locator(".swiper-slide").filter({
			has: this.page
				.getByTestId("RoyaltyUpItemName")
				.filter({ hasText: placeholderText }),
		});
	}

	public royaltyUpInProgressItem(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator(
			'div[class*="ProgressBarV4"] div[class*="StyledInternalBar"]',
		);
	}

	public royaltyUpRewardsItemClaimButton(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator("button");
	}

	public get royaltyUpSliderBlock(): Locator {
		return this.royaltyUpBlock
			.getByTestId("RoyaltyUpSlider-header")
			.locator('div[class*="HeaderButtonsContainer"]');
	}

	public royaltyUpInProgressPercentage(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).getByTestId(
			"account-popover-rank-percentage",
		);
	}

	public get royaltyUpSliderNextButton(): Locator {
		return this.royaltyUpSliderBlock.getByTestId(
			"RoyaltyUpSlider-slider-next",
		);
	}

	public get royaltyUpSliderPreviousButton(): Locator {
		return this.royaltyUpSliderBlock.getByTestId(
			"RoyaltyUpSlider-slider-prev",
		);
	}

	public specialOfferClaimedOutOfTotal(
		currentClaims: number,
		totalClaims: number,
	): Locator {
		return this.rewardsSpecialOfferCard.locator("p", {
			hasText: `Reward (${currentClaims}/${totalClaims})`,
		});
	}

	public rewardCard(reward: string): Locator {
		return this.page.locator('div[class*="RewardCard-styled__Wrapper"]', {
			has: this.page
				.getByTestId("SpecialRewardCardTitle")
				.filter({ hasText: reward }),
		});
	}

	public rewardCardButton(reward: string, buttonText: string): Locator {
		return this.rewardCard(reward)
			.getByTestId("SpecialRewardCardButton")
			.filter({
				hasText: buttonText,
			});
	}

	public rewardCardButtonValue(reward: string, buttonText: string): Locator {
		return this.rewardCardButton(reward, buttonText).locator(
			".currency-amount",
		);
	}

	public getRewardCard(type: RewardType): Locator {
		const labelMap = {
			instant_rakeback: "Instant",
			weekly: "Weekly",
			monthly: "Monthly",
		} as const;

		return this.rewardsBlock
			.locator('article[class*="RakeBackItem-styled__Wrapper"]')
			.filter({ hasText: labelMap[type] });
	}

	public getRewardAmount(type: RewardType): Locator {
		return this.getRewardCard(type)
			.getByTestId("RakeBackItemButton")
			.locator(".currency-amount");
	}

	public getRewardClaimButton(type: RewardType): Locator {
		return this.getRewardCard(type).getByTestId("RakeBackItemButton");
	}

	public get promoBannersSlider(): Locator {
		return this.page.locator(
			`div[class*="SliderPrimary-styled__SwiperContainer"]`,
		);
	}

	public get royaltyUpCardItem(): Locator {
		return this.page.locator('div[class*="RoyaltyUpItem-styled__Wrapper"]');
	}

	public get royaltyUpClaimButton(): Locator {
		return this.page
			.locator('div[class*="RoyaltyUpItem-styled__Wrapper"]', {
				hasText: "Bronze 3",
			})
			.getByTestId("RoyaltyUpItemButton");
	}
}
