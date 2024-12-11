import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { StatsAdminAsserter } from "./stats-admin-page-asserter";
import { StatsAdminMap } from "./stats-admin-page-map";
import { StatsAdminSteps } from "./stats-admin-page-steps";

export class StatsAdminPage extends BasePage<StatsAdminMap> {
	public constructor(page: Page) {
		super(page, new StatsAdminMap(page));
	}

	public override assertThat(): StatsAdminAsserter {
		return new StatsAdminAsserter(this);
	}

	public steps(): StatsAdminSteps {
		return new StatsAdminSteps(this);
	}
}
