import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";
import { escapeRegexSpecialChars } from "@support/regex-patterns";

export class PromotionsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private readonly primaryTitleSelector =
		"h2[data-testid='promotion-top-title']";
	private readonly secondaryTitleSelector =
		"h2[class*='CardTileV4Secondary-styled__TitleElement']";
	private readonly titleSelector = `${this.primaryTitleSelector}, ${this.secondaryTitleSelector}`;

	private readonly primaryLabelSelector =
		"[data-testid='category-badge-promotion-top-category-tag-custom']";
	private readonly statusLabelSelector =
		"[data-testid='category-badge-promotion-top-status-tag-custom']";
	private readonly secondaryLabelSelector =
		"[data-testid^='category-badge-promotion-card-']";
	private readonly labelSelector = `${this.primaryLabelSelector}, ${this.statusLabelSelector}, ${this.secondaryLabelSelector}`;

	private readonly cardWrapperXPathCondition =
		"contains(@class,'CardTileV4Primary-styled__CardWrapper') or contains(@class,'CardTileV4Secondary-styled__CardWrapper')";

	public get promotionsRoot(): Locator {
		return this.page.locator("main");
	}

	public get promotionsContainer(): Locator {
		return this.page.getByTestId("main-layout-content");
	}

	public get promotionsPageTitle(): Locator {
		return this.promotionsContainer.getByTestId("promotions-title").filter({
			hasText: "Promotions",
		});
	}

	public get promotionsCategoriesFilterContainer(): Locator {
		return this.promotionsContainer.getByTestId("promotion-tabs-tabs");
	}

	public promotionCardTitleByPromotionTitle(title: string): Locator {
		const exactTitleRegex = new RegExp(
			`^${escapeRegexSpecialChars(title)}$`,
		);

		return this.promotionsRoot
			.locator(this.titleSelector)
			.filter({ hasText: exactTitleRegex });
	}

	public promotionCardByPromotionTitle(title: string): Locator {
		return this.promotionCardTitleByPromotionTitle(title).locator(
			`xpath=ancestor::*[${this.cardWrapperXPathCondition}]`,
		);
	}

	public promotionEndDateTextByPromotionTitle(title: string): Locator {
		return this.promotionCardByPromotionTitle(title).getByTestId(
			"article-countdown",
		);
	}

	public promotionLabelForPromotion(
		promotionTitle: string,
		label: string,
	): Locator {
		const card = this.promotionCardByPromotionTitle(promotionTitle);

		return card.locator(this.labelSelector).filter({ hasText: label });
	}
}
