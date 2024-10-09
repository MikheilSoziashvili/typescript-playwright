import { BaseAsserter } from "@base/base-asserter";
import { SecurityAdminPage } from "./security-admin-page";

export class SecurityAdminPageAsserter extends BaseAsserter<SecurityAdminPage> {
	public constructor(page: SecurityAdminPage) {
		super(page);
	}
}
