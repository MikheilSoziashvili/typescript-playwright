import { BasePageStep } from "@pages/base/base-page-step";
import { PlainSqlAdminPage } from "./plain-sql-admin-page";

export class PlainSqlAdminSteps extends BasePageStep<PlainSqlAdminPage> {
	public constructor(page: PlainSqlAdminPage) {
		super(page);
	}
}
