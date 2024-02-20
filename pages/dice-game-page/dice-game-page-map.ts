import { Locator, Page } from "@playwright/test";
import { BaseMap } from "../base/base-map";

export class DiceGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get betField(): Locator {
		return this.page.locator("input[class*='AdornedStart']").first();
	}

	public get profitOnWinField(): Locator {
		return this.page.locator("input[class*='AdornedStart']").nth(1);
	}

	// TODO: Locator should be updated with appropriate data-testid-*
	public get multiplierField(): Locator {
		return this.page.getByLabel("Multiplier");
	}

	public get rollDiceBtn(): Locator {
		return this.page.locator('button[class*="MuiButton-sizeLarge"]');
	}

	// TODO: Locator should be updated with appropriate data-testid-*
	public get rollOverField(): Locator {
		return this.page.getByLabel("Roll Over");
	}

	// TODO: Locator should be updated with appropriate data-testid-*
	public get winChanceField(): Locator {
		return this.page.getByLabel("Win Chance");
	}

	public get diceSliderValue(): Locator {
		return this.page.locator("span[class*='MuiSlider-valueLabelLabel']");
	}

	public get diceGameAreaMessage(): Locator {
		return this.page.locator("div[class*='GameArea-styled__Message']");
	}

	public get diceResultNumberGameArea(): Locator {
		return this.page.locator("div[class*='GameArea-styled__ResultNumber']");
	}

	public get diceResultNumberHistory(): Locator {
		return this.page.locator(
			"div[style*='transform: none; transition: transform 500ms']",
		);
	}
}
