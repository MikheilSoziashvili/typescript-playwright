import { BasePageStep } from "@pages/base/base-page-step";
import { PromotionAdminPage } from "./promotion-admin-page";
import { step } from "decorators/step";

export class PromotionAdminSteps extends BasePageStep<PromotionAdminPage> {
	public constructor(page: PromotionAdminPage) {
		super(page);
	}

	@step(
		"Check that promotion is displayed in the promotion table on maximum pagination",
	)
	public async checkPromotionIsDisplayedInPromotionsTable(
		promotionName: string,
	): Promise<void> {
		await this.gamdomPage.choosePromotionsTableRowsMaxPagination();
		await this.gamdomPage
			.assertThat()
			.promotionIsDisplayedInPromotionsTable(promotionName);
	}
}
