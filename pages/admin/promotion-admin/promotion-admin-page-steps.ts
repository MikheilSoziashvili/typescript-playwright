import { BasePageStep } from "@pages/base/base-page-step";
import { PromotionAdminPage } from "./promotion-admin-page";
import { step } from "decorators/step";
import { PromotionCategories } from "@enums/promotion-categories";
import { PromotionStatuses } from "@enums/promotion-statuses";

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

	@step(
		"Check that promotion data matches expected values in the promotions table on maximum pagination",
	)
	public async checkPromotionDataMatchesMaxPagination(
		promotionTitle: string,
		expectedPromotionStatus: PromotionStatuses,
		expectedPromotionPriority: number,
		expectedPromotionCategory: PromotionCategories,
		expectedPromotionPlayNowLink: string,
	): Promise<void> {
		await this.gamdomPage.choosePromotionsTableRowsMaxPagination();
		await this.gamdomPage
			.assertThat()
			.promotionDataMatches(
				promotionTitle,
				expectedPromotionStatus,
				expectedPromotionPriority,
				expectedPromotionCategory,
				expectedPromotionPlayNowLink,
			);
	}
}
