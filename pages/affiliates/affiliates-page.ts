import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { AffiliatesPageMap } from "./affiliates-page-map";
import { AffiliatesPageAsserter } from "./affiliates-page-asserter";
import { AffiliatesPageSteps } from "./affiliates-page-steps";
import { AFFILIATES_PAGE_ENDPOINT } from "@constants/page-endpoints";

export class AffiliatesPage extends BasePage<AffiliatesPageMap> {
	public constructor(page: Page) {
		super(page, new AffiliatesPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(AFFILIATES_PAGE_ENDPOINT);
	}

	public override assertThat(): AffiliatesPageAsserter {
		return new AffiliatesPageAsserter(this);
	}

	public steps(): AffiliatesPageSteps {
		return new AffiliatesPageSteps(this);
	}

	public async addNewCode(code: string): Promise<void> {
		await this.map.newAffilitatesCodeField.fill(code);
		await this.map.saveAffiliatesCodeButton.click();
	}
}
