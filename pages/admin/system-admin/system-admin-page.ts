import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { SystemAdminAsserter } from "./system-admin-page-asserter";
import { SystemAdminMap } from "./system-admin-page-map";
import { SystemAdminSteps } from "./system-admin-page-steps";

export class SystemAdminPage extends BasePage<SystemAdminMap> {
	public constructor(page: Page) {
		super(page, new SystemAdminMap(page));
	}

	public override assertThat(): SystemAdminAsserter {
		return new SystemAdminAsserter(this);
	}

	public steps(): SystemAdminSteps {
		return new SystemAdminSteps(this);
	}
}
