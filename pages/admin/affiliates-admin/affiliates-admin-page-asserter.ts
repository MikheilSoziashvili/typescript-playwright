import { BaseAsserter } from "@pages/base/base-asserter";
import { AffiliatesAdminPage } from "./affiliates-admin-page";

export class AffiliatesAdminAsserter extends BaseAsserter<AffiliatesAdminPage> {
	public constructor(page: AffiliatesAdminPage) {
		super(page);
	}
}
