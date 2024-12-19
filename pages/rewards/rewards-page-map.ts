import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { Directions } from "@enums/directions";

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
		return this.rewardsOffersList.getByTestId("rewardsCard-instant");
	}

	public get instantRakebackClaimRewardButton(): Locator {
		return this.instantRakebackCard
			.getByTestId("rewardsCardBottom-instant")
			.locator('button:has(span:text-is("Claim reward"))');
	}

	public get instantRakebackLockedButton(): Locator {
		return this.instantRakebackCard
			.getByTestId("rewardsCardBottom-instant")
			.locator('button:has-text("Locked")');
	}

	public get instatRakebackAmount(): Locator {
		return this.instantRakebackCard
			.getByTestId("rewardsAmount-instant")
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
}
