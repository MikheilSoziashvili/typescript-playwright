import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { RainAdminAsserter } from "./rain-admin-page-asserter";
import { RainAdminMap } from "./rain-admin-page-map";
import { RainAdminSteps } from "./rain-admin-page-steps";

export class RainAdminPage extends BasePage<RainAdminMap> {
	public constructor(page: Page) {
		super(page, new RainAdminMap(page));
	}

	public override assertThat(): RainAdminAsserter {
		return new RainAdminAsserter(this);
	}

	public steps(): RainAdminSteps {
		return new RainAdminSteps(this);
	}
}
