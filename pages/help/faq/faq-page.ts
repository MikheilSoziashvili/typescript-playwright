import { Page } from "@playwright/test";
import { FaqPageMap } from "./faq-page-map";
import { BasePage } from "@base/base-page";
import { FaqPageAsserter } from "./faq-page-asserter";
import { logger } from "@logger/logger";
import { VisibilityStates } from "@enums/playwright/visibility-states";
import { FAQ_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class FaqPage extends BasePage<FaqPageMap> {
	public constructor(page: Page) {
		super(page, new FaqPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(FAQ_PAGE_ENDPOINT);
	}

	public override assertThat(): FaqPageAsserter {
		return new FaqPageAsserter(this);
	}

	public async expandAffiliateCodeRegisteredUnderSection(): Promise<void> {
		await this.map.waitFor({
			locator: this.map.expandAffiliateCodeReqisterButtonLocator,
			state: VisibilityStates.VISIBLE,
		});
		const sectionAriaExpandedAttribute =
			await this.map.expandAffiliateCodeReqisterButtonLocator.getAttribute(
				"aria-expanded",
			);
		if (sectionAriaExpandedAttribute !== "true") {
			await this.map.expandAffiliateCodeReqisterButtonLocator.click();
		} else {
			logger.info(
				"Affilaite code registered under section already expanded",
			);
		}
	}
}
