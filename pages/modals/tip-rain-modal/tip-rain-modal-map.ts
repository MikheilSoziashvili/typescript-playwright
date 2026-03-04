import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipRainModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get tipRainModal(): Locator {
		return this.page.getByTestId("tip-rain-dialog-dialog");
	}

	public get amountInput(): Locator {
		return this.tipRainModal.getByTestId("tip-rain-input-input");
	}

	public get tipButton(): Locator {
		return this.tipRainModal.getByTestId("tip-rain-tip");
	}
}
