import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { BasePageNavigationParametersType } from "@core/types/types";
import { PROMOTIONS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { PromotionsPageMap } from "./promotions-page-map";
import { PromotionsPageAsserter } from "./promotions-page-asserter";
import { PromotionsPageSteps } from "./promotions-page-steps";
import { step } from "decorators/step";

export class PromotionsPage extends BasePage<PromotionsPageMap> {
	public constructor(page: Page) {
		super(page, new PromotionsPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PROMOTIONS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PromotionsPageAsserter {
		return new PromotionsPageAsserter(this);
	}

	public steps(): PromotionsPageSteps {
		return new PromotionsPageSteps(this);
	}

	@step("Click on a promotion card by title")
	public async clickPromotionCard(promotionTitle: string): Promise<void> {
		await this.map.promotionCardByPromotionTitle(promotionTitle).click();
	}
}
