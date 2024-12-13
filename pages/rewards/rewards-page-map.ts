import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

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
}
