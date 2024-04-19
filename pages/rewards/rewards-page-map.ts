import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class RewardsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get specialOffersList(): Locator {
		return this.page.getByTestId("rewardsSpecialOffersList");
	}

	public get rewardsOffersList(): Locator {
		return this.page.getByTestId("rewardsContainer");
	}

	public get rewardsSpecialOfferCard(): Locator {
		return this.specialOffersList.getByTestId("rewardsSpecialOfferCard");
	}

	public get specialOfferActivateNowButton(): Locator {
		return this.rewardsSpecialOfferCard.getByTestId(
			"rewardsSpecialOfferActivateNowButton",
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
			.locator('button:has-text("Claim reward")');
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
