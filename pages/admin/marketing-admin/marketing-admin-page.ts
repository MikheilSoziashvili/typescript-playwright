import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { MarketingAdminAsserter } from "./marketing-admin-page-asserter";
import { MarketingAdminMap } from "./marketing-admin-page-map";
import { MarketingAdminSteps } from "./marketing-admin-page-steps";

export class MarketingAdminPage extends BasePage<MarketingAdminMap> {
	public constructor(page: Page) {
		super(page, new MarketingAdminMap(page));
	}

	public override assertThat(): MarketingAdminAsserter {
		return new MarketingAdminAsserter(this);
	}

	public steps(): MarketingAdminSteps {
		return new MarketingAdminSteps(this);
	}
}
