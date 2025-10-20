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
		return this.page.getByTestId("originals-bet-min");
	}

	public get halfButton(): Locator {
		return this.page.getByTestId("originals-bet-half");
	}

	public get maxButton(): Locator {
		return this.page.getByTestId("originals-bet-max");
	}

	public get doubleButton(): Locator {
		return this.page.getByTestId("originals-bet-double");
	}

	public get autobetSection(): Locator {
		return this.page.getByTestId("originals-mode-autobet");
	}

	public get pickRandomTilesButton(): Locator {
		return this.page.getByTestId("originals-keno-random");
	}

	public get clearTilesButton(): Locator {
		return this.page.getByTestId("originals-keno-clear");
	}

	public get startPlayingButton(): Locator {
		return this.page.getByTestId("originals-bet-submit");
	}

	public get stopPlayingButton(): Locator {
		return this.page.getByTestId("originals-bet-stop");
	}

	public get winImage(): Locator {
		return this.page.getByTestId("win-banner");
	}

	public get winMultiplier(): Locator {
		return this.page.getByTestId("win-banner-multiplier");
	}

	public get riskRowsSlider(): Locator {
		return this.page.getByTestId("originals-risk-slider");
	}

	public kenoGameTile(index: number): Locator {
		return this.page.getByTestId(`originals-keno-cell-${index}`);
	}
}
