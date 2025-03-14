import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class PlainSqlAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get plainSqlAdminPageContent(): Locator {
		return this.page.getByTestId("admin-plain-sql-page");
	}

	public get queryButton(): Locator {
		return this.plainSqlAdminPageContent.getByTestId(
			"admin-plain-sql-query-button",
		);
	}
}
