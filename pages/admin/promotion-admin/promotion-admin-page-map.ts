import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PromotionAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionsTable(): Locator {
		return this.page.locator(`table`);
	}

	public get promotionsTableBody(): Locator {
		return this.promotionsTable.locator(`tbody`);
	}

	public tableRowByPromotionTitle(promotionTitle: string): Locator {
		return this.promotionsTableBody.locator("tr").filter({
			has: this.page.locator("td:nth-child(2)", {
				hasText: promotionTitle,
			}),
		});
	}

	public promotionStatusTableLabelByPromotionTitle(
		promotionTitle: string,
	): Locator {
		return this.tableRowByPromotionTitle(promotionTitle).locator(`//td[6]`);
	}

	public promotionStatusTableActionsContainerByPromotionTitle(
		promotionTitle: string,
	): Locator {
		return this.tableRowByPromotionTitle(promotionTitle).locator(
			`//td[13]`,
		);
	}

	public promotionStatusTableActionButtonByPromotionTitle(
		promotionTitle: string,
		actionButton: string,
	): Locator {
		return this.promotionStatusTableActionsContainerByPromotionTitle(
			promotionTitle,
		).locator(`button[aria-label="${actionButton}"]`);
	}

	public promotionStatusTableDeleteButtonByPromotionTitle(
		promotionTitle: string,
	): Locator {
		return this.promotionStatusTableActionButtonByPromotionTitle(
			promotionTitle,
			"Delete this promotion",
		);
	}

	public get createNewPromotionButton(): Locator {
		return this.page.locator("button[type='button']", {
			hasText: "Create",
		});
	}
}
