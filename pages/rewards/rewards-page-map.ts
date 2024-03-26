import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class RewardsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get specialOffersList(): Locator {
		return this.page.getByTestId("rewardsSpecialOffersList");
	}

	public get rewardsSpecialOfferCard(): Locator {
		return this.specialOffersList.getByTestId("rewardsSpecialOfferCard");
	}

	public get activateNowButton(): Locator {
		return this.rewardsSpecialOfferCard.getByTestId(
			"rewardsSpecialOfferActivateNowButton",
		);
	}

	public get inProgressButton(): Locator {
		return this.rewardsSpecialOfferCard.getByTestId(
			"rewardsSpecialOfferInProgressButton",
		);
	}

	public get claimedBadge(): Locator {
		return this.rewardsSpecialOfferCard.locator("div:text-is('Claimed')");
	}
}
