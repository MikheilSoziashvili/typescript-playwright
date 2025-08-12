import { BaseAsserter } from "@pages/base/base-asserter";
import { PromotionAdminPage } from "./promotion-admin-page";
import { step } from "decorators/step";
import { PromotionStatuses } from "../../../enums/promotion-statuses";
import { expect, Locator } from "@playwright/test";
import { Timeout } from "@enums/timeout";
import { PromotionSubStatuses } from "@enums/promotion-sub-categories";
import { PromotionCategories } from "@enums/promotion-categories";

export class PromotionAdminAsserter extends BaseAsserter<PromotionAdminPage> {
	public constructor(page: PromotionAdminPage) {
		super(page);
	}

	@step("Promotion is displayed in the promotion table")
	public async promotionIsDisplayedInPromotionsTable(
		promotionTitle: string,
		timeout = Timeout.LONG,
	): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.tableRowByPromotionTitle(promotionTitle)],
			timeout,
		);
	}

	@step("Promotion is not displayed in the promotion table")
	public async promotionIsNotDisplayedInPromotionsTable(
		promotionTitle: string,
		timeout = Timeout.LONG,
	): Promise<void> {
		await this.checkElementsAreNotVisible(
			[this.gamdomPage.map.tableRowByPromotionTitle(promotionTitle)],
			timeout,
		);
	}

	@step("Promotion status matches expected value in the promotions table")
	public async promotionStatusMatches(
		promotionTitle: string,
		expectedPromotionStatus: PromotionStatuses,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.promotionStatusTableLabelByPromotionTitle(
				promotionTitle,
			),
		).toHaveText(expectedPromotionStatus);
	}

	@step("Promotion priority matches expected value in the promotions table")
	public async promotionPriorityMatches(
		promotionTitle: string,
		expectedPromotionPriority: number,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.promotionPriorityTableLabelByPromotionTitle(
				promotionTitle,
			),
		).toHaveText(expectedPromotionPriority.toString());
	}

	private async verifyPromotionField<T extends string>(
		promotionTitle: string,
		expectedValue: T,
		emptyValue: T,
		locatorFn: (title: string) => Locator,
	): Promise<void> {
		const locator = locatorFn(promotionTitle);

		if (expectedValue === emptyValue) {
			await expect(locator).toBeEmpty();
			return;
		}

		await expect(locator).toHaveText(expectedValue);
	}

	@step("Promotion type matches expected value in the promotions table")
	public async promotionTypeMatches(
		promotionTitle: string,
		expectedPromotionType: PromotionSubStatuses,
	): Promise<void> {
		await this.verifyPromotionField(
			promotionTitle,
			expectedPromotionType,
			PromotionSubStatuses.NONE,
			this.gamdomPage.map.promotionTypeTableLabelByPromotionTitle.bind(
				this.gamdomPage.map,
			),
		);
	}

	@step("Promotion category matches expected value in the promotions table")
	public async promotionCategoryMatches(
		promotionTitle: string,
		expectedPromotionCategory: PromotionCategories,
	): Promise<void> {
		await this.verifyPromotionField(
			promotionTitle,
			expectedPromotionCategory,
			PromotionCategories.ALL,
			this.gamdomPage.map.promotionCategoryTableLabelByPromotionTitle.bind(
				this.gamdomPage.map,
			),
		);
	}

	@step("Promotion play now link matches expected value in the promotions table")
	public async promotionPlayNowLinkMatches(
		promotionTitle: string,
		expectedPromotionPlayNowLink: string,
	): Promise<void> {
		await expect(
			this.gamdomPage.map.promotionPlayNowLinkTableLabelByPromotionTitle(
				promotionTitle,
			),
		).toHaveText(expectedPromotionPlayNowLink);
	}

	@step("Promotion data matches expected values in the promotions table")
	public async promotionDataMatches(
		promotionTitle: string,
		expectedPromotionStatus: PromotionStatuses,
		expectedPromotionPriority: number,
		expectedPromotionCategory: PromotionCategories,
		expectedPromotionPlayNowLink: string,
	): Promise<void> {
		await this.promotionStatusMatches(
			promotionTitle,
			expectedPromotionStatus,
		);
		await this.promotionPriorityMatches(
			promotionTitle,
			expectedPromotionPriority,
		);
		await this.promotionCategoryMatches(
			promotionTitle,
			expectedPromotionCategory,
		);
		await this.promotionPlayNowLinkMatches(
			promotionTitle,
			expectedPromotionPlayNowLink,
		);
	}
}
