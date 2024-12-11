import { BaseAsserter } from "@pages/base/base-asserter";
import { KycAdminPage } from "./kyc-admin-page";

export class KycAdminAsserter extends BaseAsserter<KycAdminPage> {
	public constructor(page: KycAdminPage) {
		super(page);
	}
}
