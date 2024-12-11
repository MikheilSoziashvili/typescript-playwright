import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class ActionsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get broadcastMessageTitle(): Locator {
		return this.page.locator(
			'h4.title:text-is("Broadcast a message to users")',
		);
	}
}
