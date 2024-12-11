import { BaseAsserter } from "@pages/base/base-asserter";
import { PlainSqlAdminPage } from "./plain-sql-admin-page";

export class PlainSqlAdminAsserter extends BaseAsserter<PlainSqlAdminPage> {
	public constructor(page: PlainSqlAdminPage) {
		super(page);
	}
}
