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
		return this.page.getByTestId("win-banner");
	}

	public get betField(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get minesNumberSlider(): Locator {
		return this.page.getByRole("slider").first();
	}

	public get minButton(): Locator {
		return this.page.getByTestId("mines-control-Min");
	}

	public get halfButton(): Locator {
		return this.page.getByTestId("mines-control-1/2");
	}

	public get maxButton(): Locator {
		return this.page.getByTestId("mines-control-Max");
	}

	public get doubleButton(): Locator {
		return this.page.getByTestId("mines-control-x2");
	}

	public get gameHistoryButton(): Locator {
		return this.page.locator("button[data-tooltip='History']");
	}

	public get gameHistoryModalContainer(): Locator {
		return this.page.locator('div[class^="ModalHistorystyled__Container"]');
	}

	public get gameHistoryTable(): Locator {
		return this.gameHistoryModalContainer.locator("table");
	}

	public get gameHistoryTableRows(): Locator {
		return this.gameHistoryTable.locator("tbody tr");
	}

	public gameHistoryTableRowByIndex(index: number): Locator {
		return this.gameHistoryTableRows.nth(index);
	}

	public gameHistoryTableRowBetAmount(index: number): Locator {
		return this.gameHistoryTableRowByIndex(index).locator("td").nth(2);
	}

	public get singleBetHistoryModal(): Locator {
		return this.page.locator('div[class^="ModalRoundstyled__Grid"]');
	}

	public get singleBetHistoryModalDetails(): Locator {
		return this.singleBetHistoryModal.locator(
			"div[class^='ModalRoundstyled__CardText']",
		);
	}

	public get betDetailsBetAmount(): Locator {
		return this.singleBetHistoryModalDetails.nth(1);
	}

	public get autobetTab(): Locator {
		return this.page.getByTestId("mines-tabs-autobet");
	}

	public get autoBetsCountInput(): Locator {
		return this.page.getByTestId("mines-autobet-bets-count");
	}

	public get onWinIncreaseByInput(): Locator {
		return this.page.getByTestId("mines-autobet-win-increase");
	}

	public get onLossIncreaseByInput(): Locator {
		return this.page.getByTestId("mines-autobet-loss-increase");
	}

	public get autoBetRandomTileButton(): Locator {
		return this.page.getByTestId("mines-random-tile");
	}

	public get startAutobetButton(): Locator {
		return this.page.getByTestId("mines-start-autobet");
	}
}
