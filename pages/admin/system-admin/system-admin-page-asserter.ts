import { BaseAsserter } from "@pages/base/base-asserter";
import { SystemAdminPage } from "./system-admin-page";

export class SystemAdminAsserter extends BaseAsserter<SystemAdminPage> {
	public constructor(page: SystemAdminPage) {
		super(page);
	}
}
