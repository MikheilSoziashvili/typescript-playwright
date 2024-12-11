import { BaseAsserter } from "@pages/base/base-asserter";
import { KothAdminPage } from "./koth-admin-page";

export class KothAdminAsserter extends BaseAsserter<KothAdminPage> {
	public constructor(page: KothAdminPage) {
		super(page);
	}
}
