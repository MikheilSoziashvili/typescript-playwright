import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PromotionPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionContainer(): Locator {
		return this.page.getByTestId("page-container-animate");
	}

	public get promotionHeaderContainer(): Locator {
		return this.promotionContainer.locator(
			"[class*='PromotionsSingle-styled__Header-sc-']",
		);
	}

	public get promotionBodyContainer(): Locator {
		return this.promotionContainer.locator(
			"[class*='PromotionsSingle-styled__GridContainer-sc-']",
		);
	}

	public get promotionRewardsLeftBlockContainer(): Locator {
		return this.promotionBodyContainer.locator(
			"[class*='RewardsInfo-styled__LeftBlock-sc-']",
		);
	}
	public get promotionRewardsButton(): Locator {
		return this.promotionRewardsLeftBlockContainer.locator("button");
	}

	public get promotionRewardsRightBlockContainer(): Locator {
		return this.promotionBodyContainer.locator(
			"[class*='PromotionsSingle-styled__RightBottomBlock-sc-']",
		);
	}

	public get promotionHowToParticipateContainer(): Locator {
		return this.promotionRewardsRightBlockContainer.locator(
			`[class*="PromotionsSingle-styled__AccordionWrapper-sc-"]`,
		);
	}

	public get promotionHowToParticipateButton(): Locator {
		return this.promotionHowToParticipateContainer.locator(
			`button[type='button']`,
		);
	}
}
