import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class CmsSportsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get noResultsMessage(): Locator {
		return this.page.getByText("No results", { exact: true });
	}
}
