import { BasePageStep } from "@pages/base/base-page-step";
import { PaymentsAdminPage } from "./payments-admin-page";

export class PaymentsAdminSteps extends BasePageStep<PaymentsAdminPage> {
	public constructor(page: PaymentsAdminPage) {
		super(page);
	}
}
