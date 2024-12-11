import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { PlainSqlAdminAsserter } from "./plain-sql-admin-page-asserter";
import { PlainSqlAdminMap } from "./plain-sql-admin-page-map";
import { PlainSqlAdminSteps } from "./plain-sql-admin-page-steps";

export class PlainSqlAdminPage extends BasePage<PlainSqlAdminMap> {
	public constructor(page: Page) {
		super(page, new PlainSqlAdminMap(page));
	}

	public override assertThat(): PlainSqlAdminAsserter {
		return new PlainSqlAdminAsserter(this);
	}

	public steps(): PlainSqlAdminSteps {
		return new PlainSqlAdminSteps(this);
	}
}
