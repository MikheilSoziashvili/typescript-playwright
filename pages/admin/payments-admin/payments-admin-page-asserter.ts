import { BaseAsserter } from "@pages/base/base-asserter";
import { PaymentsAdminPage } from "./payments-admin-page";

export class PaymentsAdminAsserter extends BaseAsserter<PaymentsAdminPage> {
	public constructor(page: PaymentsAdminPage) {
		super(page);
	}
}
