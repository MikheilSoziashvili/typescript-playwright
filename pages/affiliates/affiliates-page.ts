import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BasePage } from "@base/base-page";
import { AffiliatesPageMap } from "./affiliates-page-map";
import { AffiliatesPageAsserter } from "./affiliates-page-asserter";
import { AffiliatesPageSteps } from "./affiliates-page-steps";
import { AFFILIATES_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { Timeout } from "@enums/timeout";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Attributes } from "@enums/playwright/htmlAttributes";

export class AffiliatesPage extends BasePage<AffiliatesPageMap> {
	public constructor(page: Page) {
		super(page, new AffiliatesPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [AFFILIATES_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): AffiliatesPageAsserter {
		return new AffiliatesPageAsserter(this);
	}

	public steps(): AffiliatesPageSteps {
		return new AffiliatesPageSteps(this);
	}

	@step("Add new affiliate code")
	public async addNewCode(code: string): Promise<void> {
		await this.map.newAffilitatesCodeField.fill(code, {
			timeout: Timeout.LONG, // To be removed when issues in e2e environment are resolved
		});
		await this.map.saveAffiliatesCodeButton.click();
	}

	@step("Get affiliate link")
	public async getAffiliateLink(): Promise<string> {
		return (await this.map.copyCodeToClipboardField.getAttribute(
			Attributes.VALUE,
		)) as string;
	}
}
