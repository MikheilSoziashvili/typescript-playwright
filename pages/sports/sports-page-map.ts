import { BaseMap } from "@pages/base/base-map";
import { Page } from "@playwright/test";

export class SportsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}
}
