import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class CrashGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get mainContainer(): Locator {
		return this.page.locator("#site_content");
	}

	public get gameContainer(): Locator {
		return this.mainContainer.getByTestId("crashGridControls");
	}

	public get chart(): Locator {
		return this.gameContainer.locator("#chart-inner-container");
	}

	public get multiplierCounterProgressing(): Locator {
		return this.chart.getByTestId("crashInProgressState");
	}

	public get multiplierCounterCrashed(): Locator {
		return this.chart.getByTestId("crashStateCrashed");
	}

	public get betOptions(): Locator {
		return this.gameContainer.getByTestId("crashPlaceBetGrid");
	}

	public get yourBetContainer(): Locator {
		return this.betOptions.getByTestId("crashYourBetContainer");
	}

	public get betField(): Locator {
		return this.yourBetContainer.locator("input[class*='AdornedStart']");
	}

	public get autoCashoutContainer(): Locator {
		return this.betOptions.getByTestId("crashAutoCashoutContainer");
	}

	public get autoCashOutField(): Locator {
		return this.autoCashoutContainer.locator(
			"input[placeholder='Auto Cashout']",
		);
	}

	public get placeBetBtn(): Locator {
		return this.betOptions
			.getByTestId("crashPlaceBetButton")
			.locator("button");
	}

	public get spinningCountdownCounter(): Locator {
		return this.chart.getByTestId("crashSpinningCountdownCounter");
	}

	public get playersGridContainer(): Locator {
		return this.mainContainer.getByTestId("crashPlayersListContainer");
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

	public get betBoxesContainer(): Locator {
		return this.betOptions.getByTestId("crashCurrentBetBoxesContainer");
	}

	public get betBoxes(): Promise<Locator[]> {
		return this.betBoxesContainer.locator("div#MultiBetRow > div").all();
	}

	public betBoxBetAmount(betBox: Locator): Locator {
		return betBox.locator("input");
	}

	public get autobetButton(): Locator {
		return this.betOptions.locator('input[type="checkbox"]');
	}

	public get stopBetIfMoreThanField(): Locator {
		return this.betOptions.getByLabel("Stop if bet is more than");
	}

	public get potentialWinAmount(): Locator {
		return this.betBoxesContainer.locator("span.currency-amount").nth(1);
	}

	public get potentialText(): Locator {
		return this.betBoxesContainer.locator('h6:has-text("Paid Out")');
	}

	public get cashoutButton(): Locator {
		return this.betBoxesContainer.locator('button:has-text("Cashout")');
	}

	public get successButton(): Locator {
		return this.betBoxesContainer.locator('button:has-text("Success")');
	}

	public get onWinDropdown(): Locator {
		return this.betOptions.locator('div[role="combobox"]').nth(0);
	}

	public get onLossDropdown(): Locator {
		return this.betOptions.locator('div[role="combobox"]').nth(1);
	}

	public get onWinAndLossContainter(): Locator {
		return this.page.locator('ul[role="listbox"]');
	}

	public onConditionOption(option: string): Locator {
		return this.onWinAndLossContainter.locator("li", {
			hasText: option,
		});
	}

	public get increaseByInput(): Locator {
		return this.betOptions.locator(
			'div.MuiFormControl-root input[type="text"].MuiOutlinedInput-input',
		);
	}
}
