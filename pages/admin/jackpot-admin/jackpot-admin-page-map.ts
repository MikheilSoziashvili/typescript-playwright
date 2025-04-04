import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class JackpotAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get jackpotAdminPageContent(): Locator {
		return this.page.getByTestId("adminViewJackpotRoundsPageContent");
	}

	public get viewJackpotRoundsHeader(): Locator {
		return this.jackpotAdminPageContent.getByTestId("headerTitle");
	}
}
