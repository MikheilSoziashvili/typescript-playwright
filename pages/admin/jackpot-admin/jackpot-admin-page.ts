import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { JackpotAdminAsserter } from "./jackpot-admin-page-asserter";
import { JackpotAdminMap } from "./jackpot-admin-page-map";
import { JackpotAdminSteps } from "./jackpot-admin-page-steps";

export class JackpotAdminPage extends BasePage<JackpotAdminMap> {
	public constructor(page: Page) {
		super(page, new JackpotAdminMap(page));
	}

	public override assertThat(): JackpotAdminAsserter {
		return new JackpotAdminAsserter(this);
	}

	public steps(): JackpotAdminSteps {
		return new JackpotAdminSteps(this);
	}
}
