import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class MinesGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get startPlayingButton(): Locator {
		return this.page.getByTestId("mines-manual-start");
	}

	public get pickRandomTileButton(): Locator {
		return this.page.getByTestId("mines-manual-random");
	}

	public get manualCashoutButton(): Locator {
		return this.page.getByTestId("mines-manual-cashout");
	}

	public get bombTile(): Locator {
		return this.page.locator('[data-testid^="mines-mine-selected-"]');
	}

	public get allTiles(): Locator {
		return this.page.locator('[data-testid^="mines-tile-"]');
	}

	public get safeTiles(): Locator {
		return this.page.locator('[data-testid^="mines-gem-selected-"]');
	}

	public get numberOfMines(): Locator {
		return this.page.getByTestId("mines-count");
	}

	public get winImage(): Locator {
		return this.page.getByTestId("mines-banner");
	}

	public get betField(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get minesNumberSlider(): Locator {
		return this.page.locator('span[class*="RangeContainer"]');
	}

	public get minButton(): Locator {
		return this.page.getByTestId("mines-control-Min");
	}

	public get halfButton(): Locator {
		return this.page.getByTestId("mines-control-1/2");
	}
}
