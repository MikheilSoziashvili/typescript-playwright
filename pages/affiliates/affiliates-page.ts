import { Page } from "@playwright/test";
import { BasePage } from "../base/base-page";
import { AffiliatesPageMap } from "./affiliates-page-map";
import { AffiliatesPageAsserter } from "./affiliates-page-asserter";

export class AffiliatesPage extends BasePage<AffiliatesPageMap> {
	public constructor(page: Page) {
		super(page, new AffiliatesPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto("/affiliates");
	}

	public override assertThat(): AffiliatesPageAsserter {
		return new AffiliatesPageAsserter(this);
	}

	public async addNewCode(code: string): Promise<void> {
		await this.map.newAffilitatesCodeField.fill(code);
		await this.map.saveAffiliatesCodeButton.click();
	}
}
