import { BaseAsserter } from "@pages/base/base-asserter";
import { BaseAdminPage } from "./base-admin-page";

export class BaseAdminAsserter extends BaseAsserter<BaseAdminPage> {
	public constructor(page: BaseAdminPage) {
		super(page);
	}
}
