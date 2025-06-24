import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class KenoGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get betAmountInput(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get minButton(): Locator {
		return this.page.locator("button[class*='Buttonstyled__Button']", {
			hasText: "Min",
		});
	}

	public get halfButton(): Locator {
		return this.page.locator("button[class*='Buttonstyled__Button']", {
			hasText: "1/2",
		});
	}
}
