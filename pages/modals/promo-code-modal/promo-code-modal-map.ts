import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../../base/base-map";

export class PromoCodeModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get modalLocator(): Locator {
		return this.page.locator(
			"div.MuiPaper-elevation:has(div > img[alt='Promo Icon'])",
		);
	}

	public get claimButton(): Locator {
		return this.modalLocator.locator("button:text-is('Claim')");
	}

	public get codeInputFiled(): Locator {
		return this.modalLocator.locator("input");
	}
}
