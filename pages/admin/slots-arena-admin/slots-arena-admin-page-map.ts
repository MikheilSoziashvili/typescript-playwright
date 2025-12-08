import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class SlotsArenaAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get arenaAdminPageContent(): Locator {
		return this.page.getByTestId("adminSlotBattlesPageContent");
	}

	public get viewDetailButton(): Locator {
		return this.page.getByTestId("adminSlotBattlesVieweDetailsButton");
	}
}
