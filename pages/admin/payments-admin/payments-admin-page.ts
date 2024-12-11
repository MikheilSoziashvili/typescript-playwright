import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { PaymentsAdminAsserter } from "./payments-admin-page-asserter";
import { PaymentsAdminMap } from "./payments-admin-page-map";
import { PaymentsAdminSteps } from "./payments-admin-page-steps";

export class PaymentsAdminPage extends BasePage<PaymentsAdminMap> {
	public constructor(page: Page) {
		super(page, new PaymentsAdminMap(page));
	}

	public override assertThat(): PaymentsAdminAsserter {
		return new PaymentsAdminAsserter(this);
	}

	public steps(): PaymentsAdminSteps {
		return new PaymentsAdminSteps(this);
	}
}
