import { BaseAsserter } from "@pages/base/base-asserter";
import { PromotionAdminPage } from "./promotion-admin-page";
import { step } from "decorators/step";
import { PromotionStatuses } from "../../../enums/promotion-statuses";
import { expect } from "@playwright/test";
import { Timeout } from "@enums/timeout";

export class PromotionAdminAsserter extends BaseAsserter<PromotionAdminPage> {
	public constructor(page: PromotionAdminPage) {
		super(page);
	}

	@step("Verify that the promotion is displayed in the promotion table")
	public async promotionIsDisplayedInPromotionsTable(
		promotionTitle: string,
		timeout = Timeout.LONG,
	): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.tableRowByPromotionTitle(promotionTitle)],
			timeout,
		);
	}

	@step("Verify promotion status in the promotions table")
	public async verifyPromotionStatus(
		promotionTitle: string,
		expectedPromotionStatus: PromotionStatuses,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.promotionStatusTableLabelByPromotionTitle(
				promotionTitle,
			),
		).toHaveText(expectedPromotionStatus);
	}
}
