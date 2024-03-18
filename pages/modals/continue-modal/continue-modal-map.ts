import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class ContinueModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.locator(
			"div.MuiPaper-elevation:has(div > img[alt='Warning sign'] +p:text-is('Are you sure you want to continue?'))",
		);
	}

	public get continueButton(): Locator {
		return this.modalLocator.locator(
			"button:has(span:text-is('Continue'))",
		);
	}

	public get cancelButton(): Locator {
		return this.modalLocator.locator("button:has(span:text-is('Cancel'))");
	}
}
