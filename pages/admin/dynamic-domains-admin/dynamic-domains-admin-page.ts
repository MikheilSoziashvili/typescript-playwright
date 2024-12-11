import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { DynamicDomainsAdminAsserter } from "./dynamic-domains-admin-page-asserter";
import { DynamicDomainsAdminMap } from "./dynamic-domains-admin-page-map";
import { DynamicDomainsAdminSteps } from "./dynamic-domains-admin-page-steps";

export class DynamicDomainsAdminPage extends BasePage<DynamicDomainsAdminMap> {
	public constructor(page: Page) {
		super(page, new DynamicDomainsAdminMap(page));
	}

	public override assertThat(): DynamicDomainsAdminAsserter {
		return new DynamicDomainsAdminAsserter(this);
	}

	public steps(): DynamicDomainsAdminSteps {
		return new DynamicDomainsAdminSteps(this);
	}
}
