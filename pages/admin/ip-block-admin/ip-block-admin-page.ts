import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { IpBlockAdminAsserter } from "./ip-block-admin-page-asserter";
import { IpBlockAdminMap } from "./ip-block-admin-page-map";
import { IpBlockAdminSteps } from "./ip-block-admin-page-steps";

export class IpBlockAdminPage extends BasePage<IpBlockAdminMap> {
	public constructor(page: Page) {
		super(page, new IpBlockAdminMap(page));
	}

	public override assertThat(): IpBlockAdminAsserter {
		return new IpBlockAdminAsserter(this);
	}

	public steps(): IpBlockAdminSteps {
		return new IpBlockAdminSteps(this);
	}
}
