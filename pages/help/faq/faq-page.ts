import { Page } from "@playwright/test";
import { FaqPageMap } from "./faq-page-map";
import { BasePage } from "@base/base-page";
import { FaqPageAsserter } from "./faq-page-asserter";
import { logger } from "@logger/logger";
import { FAQ_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { BooleanValueString } from "@enums/playwright/booleanValues";

export class FaqPage extends BasePage<FaqPageMap> {
	public constructor(page: Page) {
		super(page, new FaqPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [FAQ_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): FaqPageAsserter {
		return new FaqPageAsserter(this);
	}

	public async expandAffiliateCodeRegisteredUnderSection(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.expandAffiliateCodeRegisterButtonLocator,
		});
		const sectionAriaExpandedAttribute =
			await this.map.expandAffiliateCodeRegisterButtonLocator.getAttribute(
				Attributes.ARIA_EXPANDED,
			);
		if (sectionAriaExpandedAttribute !== BooleanValueString.TRUE) {
			await this.map.expandAffiliateCodeRegisterButtonLocator.click();
		} else {
			logger.info(
				"Affilaite code registered under section already expanded",
			);
		}
	}
}
