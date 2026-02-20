import { BaseAsserter } from "@base/base-asserter";
import { PromotionPage } from "./promotion-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class PromotionPageAsserter extends BaseAsserter<PromotionPage> {
	public constructor(page: PromotionPage) {
		super(page);
	}

	@step("Verify promotion rewards button text")
	public async promotionRewardsButtonHasText(expectedText: string): Promise<void> {
		await expect(this.gamdomPage.map.promotionRewardsButton).toHaveText(expectedText);
	}
}
