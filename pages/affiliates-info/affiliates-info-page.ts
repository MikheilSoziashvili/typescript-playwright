import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { BasePage } from "@base/base-page";
import { AffiliatesInfoPageMap } from "./affiliates-info-page-map";
import { AffiliatesInfoPageAsserter } from "./affiliates-info-page-asserter";
import { AffiliatesInfoPageSteps } from "./affiliates-info-page-steps";
import { AFFILIATES_INFO_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class AffiliatesInfoPage extends BasePage<AffiliatesInfoPageMap> {
	public constructor(page: Page) {
		super(page, new AffiliatesInfoPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await super.navigate({ endpoint: { paths: [AFFILIATES_INFO_PAGE_ENDPOINT] } });
	}

	public override assertThat(): AffiliatesInfoPageAsserter {
		return new AffiliatesInfoPageAsserter(this);
	}

	public steps(): AffiliatesInfoPageSteps {
		return new AffiliatesInfoPageSteps(this);
	}

	@step("Click Join Now button")
	public async clickJoinNow(): Promise<void> {
		await this.map.joinNowButton.click();
	}

	@step("Click Download Templates button")
	public async clickDownloadTemplates(): Promise<void> {
		await this.map.downloadTemplatesButton.click();
	}
}
