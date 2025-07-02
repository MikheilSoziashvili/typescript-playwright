import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";

import { BasePageNavigationParametersType } from "@core/types/types";
import { PROMOTION_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { PromotionAdminMap } from "./promotion-admin-page-map";
import { PromotionAdminAsserter } from "./promotion-admin-page-asserter";
import { PromotionAdminSteps } from "./promotion-admin-page-steps";
import { step } from "decorators/step";

export class PromotionAdminPage extends BasePage<PromotionAdminMap> {
	public constructor(page: Page) {
		super(page, new PromotionAdminMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PROMOTION_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PromotionAdminAsserter {
		return new PromotionAdminAsserter(this);
	}

	public steps(): PromotionAdminSteps {
		return new PromotionAdminSteps(this);
	}

	@step("Click create promotion button")
	public async clickCreateNewPromotionButton(): Promise<void> {
		await this.map.createNewPromotionButton.click();
	}
}
