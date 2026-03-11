import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { Directions } from "@enums/directions";
import { RewardType } from "@enums/admin/reward-type";

export class RewardsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get rewardsBlock(): Locator {
		return this.page.locator(
			`//p[text()='Rewards']//ancestor::div[@data-testid="rewardsContainer"]`,
		);
	}

	public get royaltyUpBlock(): Locator {
		return this.page.locator(
			`//p[text()='Royalty Up']//ancestor::div[contains(@class,'SectionBody')]`,
		);
	}

	public get specialOffersList(): Locator {
		return this.page.locator(
			`//p[text()='Special Rewards']//ancestor::div[contains(@class,"SpecialRewards-styled__SectionBody")]//*[@class="swiper-wrapper"]`,
		);
	}

	public get rewardsOffersList(): Locator {
		return this.page.getByTestId("rewardsContainer");
	}

	public get rewardsSpecialOfferCard(): Locator {
		return this.specialOffersList.locator(
			`//*[contains(@class,"ItemWrapper")]`,
		);
	}

	public get specialOfferActivateNowButton(): Locator {
		return this.rewardsSpecialOfferCard.locator(
			`//button[normalize-space()="Activate"]`,
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
		return this.royaltyUpBlock.locator(
			`//div[contains(@class,"RoyaltyUpItem-styled__Item-sc") and contains(normalize-space(),"${placeholderText}")]`,
		);
	}

	public royaltyUpInProgressItem(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator(
			`//div[@class="progress-bar-inner"]//parent::div[contains(@class,'ProgressBar')]//parent::div[contains(@class,'PercentageWrapper')]`,
		);
	}

	public get royaltyUpItemsIndex(): Locator {
		return this.royaltyUpBlock.locator(
			`div[class*="RoyaltyUpItem-styled__Item-sc"]`,
		);
	}

	public royaltyUpItemClaimButton(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator(`//button`);
	}

	public royaltyUpRewardsItemSwiperSlide(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator(
			"xpath=ancestor::div[contains(@class, 'swiper-slide')]",
		);
	}

	public royaltyUpRewardsItemButton(placeholderText: string): Locator {
		return this.royaltyUpRewardsItem(placeholderText).locator("//button");
	}

	public get royaltyUpSliderBlock(): Locator {
		return this.royaltyUpBlock.locator(
			`div[class*="SliderWrapper"] div[class*="ButtonsWrapper"]`,
		);
	}

	private royaltyUpSliderButtonsContainer(arrowButton: string): Locator {
		return this.royaltyUpSliderBlock.locator(
			`//i[contains(@class,'${arrowButton}')]//parent::button`,
		);
	}

	public get royaltyUpSliderNextButton(): Locator {
		return this.royaltyUpSliderButtonsContainer(Directions.RIGHT);
	}

	public get royaltyUpSliderPreviousButton(): Locator {
		return this.royaltyUpSliderButtonsContainer(Directions.LEFT);
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
		return this.page.locator('div[class^="common-styled__ItemWrapper"]', {
			has: this.page.getByText(reward),
		});
	}

	public rewardCardButton(reward: string, buttonText: string): Locator {
		return this.rewardCard(reward).locator("button", {
			has: this.page.getByText(buttonText),
		});
	}

	public rewardCardButtonValue(reward: string, buttonText: string): Locator {
		return this.rewardCardButton(reward, buttonText).locator(
			".currency-amount",
		);
	}

	public getRewardCard(type: RewardType): Locator {
		return this.page.getByTestId(`rewardsCard-${type}`);
	}

	public getRewardAmount(type: RewardType): Locator {
		return this.getRewardCard(type).getByTestId(`rewardsAmount-${type}`);
	}

	public getRewardClaimButton(type: RewardType): Locator {
		return this.getRewardCard(type).locator("button", {
			hasText: "Claim Reward",
		});
	}

	public get royaltyUpCardItem(): Locator {
		return this.page.locator(`div[class*="RoyaltyUpItem-styled__Item-sc"]`);
	}

	public get royaltyUpClaimButton(): Locator {
		return this.page
			.locator('div[class*="RoyaltyUpItem-styled__Item-sc"]', {
				hasText: "Bronze 3",
			})
			.locator('button:has-text("Claim")');
	}
}
