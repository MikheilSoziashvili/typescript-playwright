import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class DiceGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get yourBetContainer(): Locator {
		return this.page.locator("div[data-testid=diceYourBetContainer]");
	}
	public get betField(): Locator {
		return this.yourBetContainer.locator("input");
	}

	public get profitOnWinContainer(): Locator {
		return this.page.locator("div[data-testid=diceProfitOnWinContainer]");
	}

	public get profitOnWinField(): Locator {
		return this.profitOnWinContainer.locator("input");
	}

	public get multiplierContainer(): Locator {
		return this.page.locator(
			"div[data-testid=diceRollMultiplierContainer]",
		);
	}

	public get multiplierField(): Locator {
		return this.multiplierContainer.locator("input");
	}

	public get rollOverContainer(): Locator {
		return this.page.locator("div[data-testid=diceRollOverContainer]");
	}

	public get rollOverField(): Locator {
		return this.rollOverContainer.locator("input");
	}

	public get winChanceContainer(): Locator {
		return this.page.locator("div[data-testid=diceRollWinChanceContainer]");
	}

	public get winChanceField(): Locator {
		return this.winChanceContainer.locator("input");
	}

	public get rollDiceBtn(): Locator {
		return this.page.locator("button[data-testid=rollDiceBtn]");
	}

	public get diceSliderValue(): Locator {
		return this.page.locator("span[class*='MuiSlider-valueLabelLabel']");
	}

	public get diceGameAreaMessage(): Locator {
		return this.page.locator("div[data-testid=diceGameAreaMessage]");
	}

	public get diceResultNumberGameArea(): Locator {
		return this.page.locator("div[data-testid=diceResult]");
	}

	public get diceResultsHistory(): Locator {
		return this.page.locator("div[data-testid=diceRollHistoryResults]");
	}

	public get diceLastResultNumber(): Locator {
		return this.diceResultsHistory.locator("div").first();
	}
}
