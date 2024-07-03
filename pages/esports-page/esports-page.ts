import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { EsportsPageMap } from "./esports-page-map";
import { ESPORTS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { EsportsPageAsserter } from "./esports-page-asserter";

export class EsportsPage extends BasePage<EsportsPageMap> {
	public constructor(page: Page) {
		super(page, new EsportsPageMap(page));
	}

	public override async navigate(): Promise<void> {
		await this.page.goto(ESPORTS_PAGE_ENDPOINT);
	}

	public override assertThat(): EsportsPageAsserter {
		return new EsportsPageAsserter(this);
	}
}
