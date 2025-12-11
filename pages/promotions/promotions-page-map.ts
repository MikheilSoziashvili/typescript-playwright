import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class PromotionsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionsContainer(): Locator {
		return this.page.getByTestId("page-container-animate");
	}

	public get promotionsPageTitle(): Locator {
		return this.promotionsContainer.locator("h1", {
			hasText: "Promotions",
		});
	}

	public get promotionsCategoriesFilterContainer(): Locator {
		return this.promotionsContainer.getByTestId("gam-tabs");
	}

	public promotionCardByPromotionTitle(promotionTitle: string): Locator {
		return this.promotionCardTitleByPromotionTitle(promotionTitle).locator(
			`//ancestor::div[contains(@class,'PromoCard-styled__PromoCard-sc-') or contains(@class,'PromoCard-styled__BannerContainer-sc-')]`,
		);
	}

	public promotionCardTitleByPromotionTitle(promotionTitle: string): Locator {
		return this.promotionsContainer
			.locator("h2[class*='PromoDetails-styled__Title-sc-']")
			.filter({ hasText: promotionTitle })
			.filter({ has: this.page.locator(`text="${promotionTitle}"`) });
	}

	private readonly primaryTitleSelector =
		"h2[data-testid='promotion-top-title']";
	private readonly secondaryTitleSelector =
		"h2[class*='CardTileV4Secondary-styled__TitleElement']";
	private readonly titleSelectorV4 = `${this.primaryTitleSelector}, ${this.secondaryTitleSelector}`;

	private readonly primaryLabelSelector =
		"[data-testid='category-badge-promotion-top-category-tag-custom']";
	private readonly statusLabelSelector =
		"[data-testid='category-badge-promotion-top-status-tag-custom']";
	private readonly secondaryLabelSelector =
		"[data-testid^='category-badge-promotion-card-']";
	private readonly labelSelectorV4 = `${this.primaryLabelSelector}, ${this.statusLabelSelector}, ${this.secondaryLabelSelector}`;

	private readonly cardWrapperXPathCondition =
		"contains(@class,'CardTileV4Primary-styled__CardWrapper') or contains(@class,'CardTileV4Secondary-styled__CardWrapper')";

	public get promotionsContainerV4(): Locator {
		return this.page.getByTestId("main-layout-content");
	}

	public get promotionsPageTitleV4(): Locator {
		return this.promotionsContainerV4
			.getByTestId("promotions-title")
			.filter({
				hasText: "Promotions",
			});
	}

	public get promotionsCategoriesFilterContainerV4(): Locator {
		return this.promotionsContainerV4.getByTestId("promotion-tabs-tabs");
	}

	public get promotionsRootV4(): Locator {
		return this.page.locator("main");
	}

	public promotionLabelForPromotionV4(
		promotionTitle: string,
		label: string,
	): Locator {
		const card = this.promotionCardByPromotionTitleV4(promotionTitle);

		return card.locator(this.labelSelectorV4).filter({ hasText: label });
	}

	public promotionCardByPromotionTitleV4(title: string): Locator {
		return this.promotionCardTitleByPromotionTitleV4(title).locator(
			`xpath=ancestor::*[${this.cardWrapperXPathCondition}]`,
		);
	}

	public promotionCardTitleByPromotionTitleV4(title: string): Locator {
		return this.promotionsRootV4
			.locator(this.titleSelectorV4)
			.filter({ hasText: title });
	}
}
