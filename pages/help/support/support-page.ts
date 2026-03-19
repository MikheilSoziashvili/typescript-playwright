import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { SUPPORT_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { Page } from "@playwright/test";
import { SupportPageAsserter } from "./support-page-asserter";
import { SupportPageMap } from "./support-page-map";
import { SupportPageSteps } from "./support-page-steps";

export class SupportPage extends BasePage<SupportPageMap> {
	public constructor(page: Page) {
		super(page, new SupportPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [SUPPORT_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): SupportPageAsserter {
		return new SupportPageAsserter(this);
	}

	public steps(): SupportPageSteps {
		return new SupportPageSteps(this);
	}
}
