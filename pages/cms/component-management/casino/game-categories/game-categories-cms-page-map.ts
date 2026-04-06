import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class GameCategoriesMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get pageHeading(): Locator {
		return this.page.getByRole("heading", {
			name: "Game Categories (Tabs)",
			exact: true,
		});
	}

	public get saveButton(): Locator {
		return this.page.getByRole("button", { name: "Save", exact: true });
	}

	public get discardButton(): Locator {
		return this.page.getByRole("button", { name: "Discard", exact: true });
	}
}
