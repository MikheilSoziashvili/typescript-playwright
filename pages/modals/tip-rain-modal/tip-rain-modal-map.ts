import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipRainModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get tipRainModal(): Locator {
		return this.page.locator(
			`//div[contains(@class,'TipRainDialog-styled__Container-sc-')]//ancestor::div[contains(@class,'MuiPaper-elevation')]`,
		);
	}

	public get amountInput(): Locator {
		return this.tipRainModal.locator(`input`);
	}

	public get tipButton(): Locator {
		return this.tipRainModal.locator(`button`, {
			has: this.page.locator(`span`, { hasText: "Tip" }),
		});
	}
}
