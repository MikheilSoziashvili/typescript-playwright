import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { ActionsAdminAsserter } from "./actions-admin-page-asserter";
import { ActionsAdminMap } from "./actions-admin-page-map";
import { ActionsAdminSteps } from "./actions-admin-page-steps";

export class ActionsAdminPage extends BasePage<ActionsAdminMap> {
	public constructor(page: Page) {
		super(page, new ActionsAdminMap(page));
	}

	public override assertThat(): ActionsAdminAsserter {
		return new ActionsAdminAsserter(this);
	}

	public steps(): ActionsAdminSteps {
		return new ActionsAdminSteps(this);
	}
}
