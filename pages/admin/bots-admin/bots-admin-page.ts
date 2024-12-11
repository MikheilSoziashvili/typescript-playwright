import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { BotsAdminAsserter } from "./bots-admin-page-asserter";
import { BotsAdminMap } from "./bots-admin-page-map";
import { BotsAdminSteps } from "./bots-admin-page-steps";

export class BotsAdminPage extends BasePage<BotsAdminMap> {
	public constructor(page: Page) {
		super(page, new BotsAdminMap(page));
	}

	public override assertThat(): BotsAdminAsserter {
		return new BotsAdminAsserter(this);
	}

	public steps(): BotsAdminSteps {
		return new BotsAdminSteps(this);
	}
}
