import { BaseAsserter } from "@base/base-asserter";
import { PromotionPage } from "./promotion-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import { logger } from "@logger/logger";

export class PromotionPageAsserter extends BaseAsserter<PromotionPage> {
	public constructor(page: PromotionPage) {
		super(page);
	}

	@step("Verify promotion rewards button text")
	public async promotionRewardsButtonHasText(
		expectedText: string,
	): Promise<void> {
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.promotionRewardsButton,
				expectedText: expectedText,
			},
		]);
	}

	@step("Verify that the promotion details page is loaded")
	public async promotionDetailsPageIsLoaded(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.promotionContainer],
			undefined,
			"Promotion details page should be loaded",
		);
	}

	@step("Verify that the promotion end date matches the expected format")
	public async promotionEndDateMatchesFormat(
		expectedFormat: RegExp,
	): Promise<void> {
		const endDateLocator = this.gamdomPage.map.promotionEndDateText;
		const actualText = await endDateLocator.textContent();
		logger.info(
			`Promotion details end date — actual: "${actualText}", expected pattern: ${expectedFormat}`,
		);
		await expect(
			endDateLocator,
			`Promotion details end date should match format ${expectedFormat}, but got "${actualText}"`,
		).toHaveText(expectedFormat);
	}

	@step(
		"Verify promotion details page is loaded with correct end date format",
	)
	public async promotionDetailsPageIsLoadedWithEndDateFormat(
		expectedFormat: RegExp,
	): Promise<void> {
		await this.promotionDetailsPageIsLoaded();
		await this.promotionEndDateMatchesFormat(expectedFormat);
	}
}
