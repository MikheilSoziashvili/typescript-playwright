import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { EvRewardsSystemAdminAsserter } from "./ev-rewards-system-admin-page-asserter";
import { EvRewardsSystemAdminMap } from "./ev-rewards-system-admin-page-map";
import { EvRewardsSystemAdminSteps } from "./ev-rewards-system-admin-page-steps";

export class EvRewardsSystemAdminPage extends BasePage<EvRewardsSystemAdminMap> {
	public constructor(page: Page) {
		super(page, new EvRewardsSystemAdminMap(page));
	}

	public override assertThat(): EvRewardsSystemAdminAsserter {
		return new EvRewardsSystemAdminAsserter(this);
	}

	public steps(): EvRewardsSystemAdminSteps {
		return new EvRewardsSystemAdminSteps(this);
	}
}
