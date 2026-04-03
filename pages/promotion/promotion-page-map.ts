import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PromotionPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionContainer(): Locator {
		return this.page.getByTestId("promotion-details").first();
	}

	public get promotionHeaderContainer(): Locator {
		return this.promotionContainer.getByTestId(
			"promotion-details-detail-head-container",
		);
	}

	public get promotionRewardsLeftBlockContainer(): Locator {
		return this.promotionContainer.getByTestId(
			"promotion-details-sticky-content-container",
		);
	}
	public get promotionRewardsButton(): Locator {
		return this.promotionRewardsLeftBlockContainer.getByTestId(
			"promotion-details-button-link",
		);
	}

	public get promotionRewardsRightBlockContainer(): Locator {
		return this.promotionContainer.getByTestId(
			"promotion-details-content-container",
		);
	}

	public get promotionEndDateText(): Locator {
		return this.promotionContainer.getByTestId(
			"promotion-details-item-text",
		);
	}

	public get promotionHowToParticipateContainer(): Locator {
		return this.promotionRewardsRightBlockContainer.getByTestId(
			"accordion-head-promotion-details-how-to-participate",
		);
	}
}
