import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class SlotsBattlePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get createBattleButton(): Locator {
		return this.page.locator('button:text-is("Create Battle")');
	}

	public get yourBattlesSection(): Locator {
		return this.page.locator('div > div > span:text-is("Your Battles")');
	}

	public get activeBattlesSection(): Locator {
		return this.page.locator('div > div > span:text-is("Active Battles")');
	}
}
