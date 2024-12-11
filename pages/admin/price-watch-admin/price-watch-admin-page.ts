import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { PriceWatchAdminAsserter } from "./price-watch-admin-page-asserter";
import { PriceWatchAdminMap } from "./price-watch-admin-page-map";
import { PriceWatchAdminSteps } from "./price-watch-admin-page-steps";

export class PriceWatchAdminPage extends BasePage<PriceWatchAdminMap> {
	public constructor(page: Page) {
		super(page, new PriceWatchAdminMap(page));
	}

	public override assertThat(): PriceWatchAdminAsserter {
		return new PriceWatchAdminAsserter(this);
	}

	public steps(): PriceWatchAdminSteps {
		return new PriceWatchAdminSteps(this);
	}
}
