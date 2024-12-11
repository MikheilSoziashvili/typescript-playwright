import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { KycAdminAsserter } from "./kyc-admin-page-asserter";
import { KycAdminMap } from "./kyc-admin-page-map";
import { KycAdminSteps } from "./kyc-admin-page-steps";

export class KycAdminPage extends BasePage<KycAdminMap> {
	public constructor(page: Page) {
		super(page, new KycAdminMap(page));
	}

	public override assertThat(): KycAdminAsserter {
		return new KycAdminAsserter(this);
	}

	public steps(): KycAdminSteps {
		return new KycAdminSteps(this);
	}
}
