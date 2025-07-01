import { BaseAsserter } from "@base/base-asserter";
import { PromotionsPage } from "./promotions-page";
import { step } from "decorators/step";

export class PromotionsPageAsserter extends BaseAsserter<PromotionsPage> {
	public constructor(page: PromotionsPage) {
		super(page);
	}

	@step("Verify that the promotion is displayed in the promotions page")
	public async promotionIsDisplayedInPromotionsPage(
		promotionTitle: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.promotionCardByPromotionTitle(promotionTitle),
		]);
	}

	@step("Verify that the promotion is not displayed in the promotions page")
	public async promotionIsNotDisplayedInPromotionsPage(
		promotionTitle: string,
	): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.promotionCardByPromotionTitle(promotionTitle),
		]);
	}
}
