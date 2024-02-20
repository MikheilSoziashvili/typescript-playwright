import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class CrashGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get mainContainer(): Locator {
		return this.page.locator("#site_content");
	}

	public get gameContainer(): Locator {
		return this.mainContainer.locator("*[class*='GridControls']");
	}

	public get chart(): Locator {
		return this.gameContainer.locator("#chart-inner-container");
	}

	public get multiplierCounterProgressing(): Locator {
		return this.chart.locator("> div:nth-child(1) div:nth-child(1)");
	}

	public get multiplierCounterCrashed(): Locator {
		return this.multiplierCounterProgressing.locator("div:nth-child(1)");
	}

	public get betOptions(): Locator {
		return this.gameContainer.locator("*[class*='GridPlaceBet']");
	}

	public get betField(): Locator {
		return this.betOptions.locator("input[class*='AdornedStart']");
	}

	public get autoCashOutField(): Locator {
		return this.betOptions.locator(
			"input[type='number'][class*='AdornedEnd']",
		);
	}

	public get placeBetBtn(): Locator {
		return this.betOptions.locator(
			"> div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) button",
		);
	}

	public get spinningCountdownCounter(): Locator {
		return this.chart.locator("> div:nth-child(1) div:nth-child(2)");
	}

	public get playersGridContainer(): Locator {
		return this.mainContainer.locator("div[class*='PlayersList']");
	}

	public get playersGrid(): Locator {
		return this.playersGridContainer.getByLabel("grid");
	}

	public get playersGridRows(): Locator {
		return this.playersGridContainer
			.getByLabel("grid")
			.getByRole("rowgroup")
			.getByRole("row");
	}

	public get playersGridRowCells(): Locator {
		return this.playersGridContainer
			.getByLabel("grid")
			.getByRole("rowgroup")
			.getByRole("row")
			.getByRole("gridcell");
	}

	public get betBoxes(): Promise<Locator[]> {
		return this.betOptions
			.locator("> div:nth-child(2) > div:nth-child(4) #MultiBetRow > div")
			.all();
	}

	public betBoxBetAmount(betBox: Locator): Locator {
		return betBox.locator("input");
	}
}
