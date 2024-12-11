import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { AffiliatesAdminAsserter } from "./affiliates-admin-page-asserter";
import { AffiliatesAdminMap } from "./affiliates-admin-page-map";
import { AffiliatesAdminSteps } from "./affiliates-admin-page-steps";

export class AffiliatesAdminPage extends BasePage<AffiliatesAdminMap> {
	public constructor(page: Page) {
		super(page, new AffiliatesAdminMap(page));
	}

	public override assertThat(): AffiliatesAdminAsserter {
		return new AffiliatesAdminAsserter(this);
	}

	public steps(): AffiliatesAdminSteps {
		return new AffiliatesAdminSteps(this);
	}
}
