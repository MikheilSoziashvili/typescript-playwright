import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class DynamicDomainsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get dynamicDomainsAdminPageContent(): Locator {
		return this.page.getByTestId("adminCurrentDomainsPageContent");
	}

	public get currentDomainsHeader(): Locator {
		return this.dynamicDomainsAdminPageContent.getByTestId(
			"adminCurrentDomainsHeader",
		);
	}
}
