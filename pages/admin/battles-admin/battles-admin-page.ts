import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { BattlesAdminAsserter } from "./battles-admin-page-asserter";
import { BattlesAdminMap } from "./battles-admin-page-map";
import { BattlesAdminSteps } from "./battles-admin-page-steps";

export class BattlesAdminPage extends BasePage<BattlesAdminMap> {
	public constructor(page: Page) {
		super(page, new BattlesAdminMap(page));
	}

	public override assertThat(): BattlesAdminAsserter {
		return new BattlesAdminAsserter(this);
	}

	public steps(): BattlesAdminSteps {
		return new BattlesAdminSteps(this);
	}
}
