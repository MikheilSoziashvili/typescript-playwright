import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { OpenTradesAdminAsserter } from "./open-trades-admin-page-asserter";
import { OpenTradesAdminMap } from "./open-trades-admin-page-map";
import { OpenTradesAdminSteps } from "./open-trades-admin-page-steps";

export class OpenTradesAdminPage extends BasePage<OpenTradesAdminMap> {
	public constructor(page: Page) {
		super(page, new OpenTradesAdminMap(page));
	}

	public override assertThat(): OpenTradesAdminAsserter {
		return new OpenTradesAdminAsserter(this);
	}

	public steps(): OpenTradesAdminSteps {
		return new OpenTradesAdminSteps(this);
	}
}
