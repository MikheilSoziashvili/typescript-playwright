import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KothMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get kothBannerImage(): Locator {
		return this.page.locator(
			"div[class*='Page-styled'] img[src*='/build/koth']",
		);
	}

	public get kothBannerCurrencyAmount(): Locator {
		return this.kothBannerImage
			.locator("..")
			.locator("span.currency-amount");
	}

	public get kothBannerTimerContainer(): Locator {
		return this.page.locator(
			"(//div[contains(@class,'Page-styled')]//div[1]//div[last()]//span)[1]",
		);
	}
}
