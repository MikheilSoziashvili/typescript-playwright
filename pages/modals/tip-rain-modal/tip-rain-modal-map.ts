import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class TipRainModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get tipRainModal(): Locator {
		return this.page.getByTestId("tipRainDialogModalContainer");
	}

	public get amountInput(): Locator {
		return this.tipRainModal.locator(`input`);
	}

	public get tipButton(): Locator {
		return this.tipRainModal.getByTestId("tipRainDialogButton");
	}
}
