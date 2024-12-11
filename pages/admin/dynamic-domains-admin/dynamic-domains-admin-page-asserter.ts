import { BaseAsserter } from "@pages/base/base-asserter";
import { DynamicDomainsAdminPage } from "./dynamic-domains-admin-page";

export class DynamicDomainsAdminAsserter extends BaseAsserter<DynamicDomainsAdminPage> {
	public constructor(page: DynamicDomainsAdminPage) {
		super(page);
	}
}
