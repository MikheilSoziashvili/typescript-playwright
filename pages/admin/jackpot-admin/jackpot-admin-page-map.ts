import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class JackpotAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get viewJackpotRoundsHeader(): Locator {
		return this.page.locator(
			'h3.trans_head.mt0:text-is("View jackpot rounds")',
		);
	}
}
