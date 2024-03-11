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
		return this.mainContainer.locator("div[data-testid=crashGridControls]");
	}

	public get chart(): Locator {
		return this.gameContainer.locator("#chart-inner-container");
	}

	public get multiplierCounterProgressing(): Locator {
		return this.chart.locator("div[data-testid=crashInProgressState]");
	}

	public get multiplierCounterCrashed(): Locator {
		return this.chart.locator("div[data-testid=crashStateCrashed]");
	}

	public get betOptions(): Locator {
		return this.gameContainer.locator("div[data-testid=crashPlaceBetGrid]");
	}

	public get yourBetContainer(): Locator {
		return this.betOptions.locator(
			"div[data-testid=crashYourBetContainer]",
		);
	}

	public get betField(): Locator {
		return this.yourBetContainer.locator("input[class*='AdornedStart']");
	}

	public get autoCashoutContainer(): Locator {
		return this.betOptions.locator(
			"div[data-testid=crashAutoCashoutContainer]",
		);
	}

	public get autoCashOutField(): Locator {
		return this.autoCashoutContainer.locator(
			"input[placeholder='Auto Cashout']",
		);
	}

	public get placeBetBtn(): Locator {
		return this.autoCashoutContainer.locator(
			"+ div + div button:has(span:text-is('Place Bet'))",
		);
	}

	public get spinningCountdownCounter(): Locator {
		return this.chart.locator(
			"div[data-testid=crashSpinningCountdownCounter]",
		);
	}

	public get playersGridContainer(): Locator {
		return this.mainContainer.locator(
			"div[data-testid=crashPlayersListContainer]",
		);
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
