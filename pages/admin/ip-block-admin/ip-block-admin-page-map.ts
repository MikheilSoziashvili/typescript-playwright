import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class IpBlockAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get blockNewIpAddressButton(): Locator {
		return this.page.getByTestId("blockNewIpAddressButton");
	}
}
