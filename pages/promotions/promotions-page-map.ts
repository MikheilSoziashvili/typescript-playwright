import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PromotionsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionsContainer(): Locator {
		return this.page.getByTestId("page-container-animate");
	}

	public promotionCardByPromotionTitle(promotionTitle: string): Locator {
		return this.promotionCardTitleByPromotionTitle(promotionTitle).locator(
			`//ancestor::div[contains(@class,'PromoCard-styled__PromoCard-sc-') or contains(@class,'PromoCard-styled__BannerContainer-sc-')]`,
		);
	}

	public promotionCardTitleByPromotionTitle(promotionTitle: string): Locator {
		return this.promotionsContainer.locator(
			"h2[class*='PromoDetails-styled__Title-sc-']",
			{ hasText: promotionTitle },
		);
	}
}
