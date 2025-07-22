import { BasePage } from "@base/base-page";
import { PROMOTIONS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { PromotionPageAsserter } from "./promotion-page-asserter";
import { PromotionPageMap } from "./promotion-page-map";
import { PromotionPageSteps } from "./promotion-page-steps";

export class PromotionPage extends BasePage<PromotionPageMap> {
	public constructor(page: Page) {
		super(page, new PromotionPageMap(page));
	}

	@step("Navigate to promotion page")
	public async navigateToPromotion(
		promotionUrl: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await this.navigate({
			...parameters,
			endpoint: { paths: [PROMOTIONS_PAGE_ENDPOINT, promotionUrl] },
		});
	}

	public override assertThat(): PromotionPageAsserter {
		return new PromotionPageAsserter(this);
	}

	public steps(): PromotionPageSteps {
		return new PromotionPageSteps(this);
	}
}
