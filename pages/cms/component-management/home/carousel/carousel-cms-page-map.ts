import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class HomeCarouselMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get pageHeading(): Locator {
		return this.page.getByRole("heading", { name: "Carousel", exact: true });
	}

	public getLocaleSelector(locale: string): Locator {
		return this.page.getByRole("combobox").filter({ hasText: locale });
	}

	public get saveButton(): Locator {
		return this.page.getByRole("button", { name: "Save", exact: true });
	}

	public get discardButton(): Locator {
		return this.page.getByRole("button", { name: "Discard", exact: true });
	}
}
