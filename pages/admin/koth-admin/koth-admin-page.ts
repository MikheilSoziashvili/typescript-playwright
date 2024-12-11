import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { KothAdminAsserter } from "./koth-admin-page-asserter";
import { KothAdminMap } from "./koth-admin-page-map";
import { KothAdminSteps } from "./koth-admin-page-steps";

export class KothAdminPage extends BasePage<KothAdminMap> {
	public constructor(page: Page) {
		super(page, new KothAdminMap(page));
	}

	public override assertThat(): KothAdminAsserter {
		return new KothAdminAsserter(this);
	}

	public steps(): KothAdminSteps {
		return new KothAdminSteps(this);
	}
}
