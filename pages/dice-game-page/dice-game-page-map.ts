import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { DiceAutobetSectionName } from "@enums/dice-autobet-section-name";

export class DiceGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get diceGameAreaMessage(): Locator {
		return this.page.getByTestId("diceGameAreaMessage");
	}

	public get diceRollHistoryContainer(): Locator {
		return this.page.getByTestId("diceRollHistoryContainer");
	}

	public get diceRollHistoryButton(): Locator {
		return this.diceRollHistoryContainer.locator("img");
	}

	public get diceLastResultBetValue(): Locator {
		return this.diceHistoryResultsModal
			.locator("span.currency-amount")
			.first();
	}

	public get diceAutobetTabButton(): Locator {
		return this.page.getByTestId("diceAutoTabButton");
	}

	public get autobetContainer(): Locator {
		return this.page.locator("div[class*=styled__GameBoxBody]");
	}

	public get diceHistoryResultsModal(): Locator {
		return this.page.locator('div[class*="Modal-styled_"]');
	}

	private getAutobetSectionLocator(
		sectionName: DiceAutobetSectionName,
	): Locator {
		return this.page.locator("div[class*=MuiFormControl-root]", {
			has: this.page.locator("label[class*=MuiFormLabel-root]", {
				hasText: sectionName,
			}),
		});
	}

	public get autobetYourBetInput(): Locator {
		return this.getAutobetSectionLocator(
			DiceAutobetSectionName.YOUR_BET,
		).locator("input");
	}

	public get autobetRollOverInput(): Locator {
		return this.getAutobetSectionLocator(
			DiceAutobetSectionName.ROLL_OVER,
		).locator("input");
	}

	public get autobetNbOfBetsInput(): Locator {
		return this.getAutobetSectionLocator(
			DiceAutobetSectionName.NUMBER_OF_BETS,
		).locator("input");
	}

	public get autobetStopOnProfitInput(): Locator {
		return this.getAutobetSectionLocator(
			DiceAutobetSectionName.STOP_ON_PROFIT,
		).locator("input");
	}

	public get autobetStopOnLossInput(): Locator {
		return this.getAutobetSectionLocator(
			DiceAutobetSectionName.STOP_ON_LOSS,
		).locator("input");
	}

	public get startAutobetButton(): Locator {
		return this.autobetContainer.locator("button", {
			hasText: "Start Autobet",
		});
	}

	public get stopAutobetButton(): Locator {
		return this.autobetContainer.locator("button", {
			hasText: "Stop Autobet",
		});
	}

	public get betMenu(): Locator {
		return this.page.locator('div[class*="GameBox"][class*="MuiBox-root"]');
	}

	private getInputLocatorByLabel(labelText: string | RegExp): Locator {
		return this.page
			.locator("label", { hasText: labelText })
			.locator("..")
			.locator("input");
	}

	public get onWinIncreaseByInput(): Locator {
		return this.getInputLocatorByLabel("On Win");
	}

	public get onLossIncreaseByInput(): Locator {
		return this.getInputLocatorByLabel(/^On Loss$/);
	}

	public get manualYourBetContainer(): Locator {
		return this.page.getByTestId("dice-your-bet-container");
	}

	public get manualBetField(): Locator {
		return this.manualYourBetContainer.getByTestId("dice-your-bet-input");
	}

	public get manualMultiplierContainer(): Locator {
		return this.page.getByTestId("dice-game-area-multiplier-container");
	}

	public get manualMultiplierField(): Locator {
		return this.manualMultiplierContainer.getByTestId(
			"dice-game-area-multiplier-input",
		);
	}

	public get rollDiceBtn(): Locator {
		return this.page.getByTestId("dice-roll-dice-btn");
	}

	public get manualRollOverContainer(): Locator {
		return this.page.getByTestId("dice-game-area-roll-over-container");
	}

	public get manualRollOverField(): Locator {
		return this.manualRollOverContainer.getByTestId(
			"dice-game-area-roll-over-input",
		);
	}

	public get manualWinChanceContainer(): Locator {
		return this.page.getByTestId("dice-game-area-win-chance-container");
	}

	public get manualWinChanceField(): Locator {
		return this.manualWinChanceContainer.getByTestId(
			"dice-game-area-win-chance-input",
		);
	}

	public get manualProfitOnWinContainer(): Locator {
		return this.page.getByTestId("dice-profit-on-win-container");
	}

	public get manualProfitOnWinField(): Locator {
		return this.manualProfitOnWinContainer.getByTestId(
			"dice-profit-on-win-input",
		);
	}

	public get diceSliderValue(): Locator {
		return this.page
			.getByTestId("diceSlider")
			.locator("div[class*='DiceSliderPinResultNumber']");
	}

	public get diceResultNumberGameArea(): Locator {
		return this.page.locator(
			"div[class*='DiceSlider-styled__SliderPinResultNumber-sc']",
		);
	}

	public get diceResultsHistory(): Locator {
		return this.page.getByTestId("diceRollHistoryResults");
	}

	public get diceAllLastResultsNumber(): Locator {
		return this.diceResultsHistory.locator("div");
	}

	public get diceLastResultNumber(): Locator {
		return this.diceAllLastResultsNumber.first();
	}

	public get fairnessButton(): Locator {
		return this.page.locator('[data-testid="tabs-txt-tab"]', {
			hasText: "Fairness",
		});
	}

	public get fairnessTableBody(): Locator {
		return this.page.getByTestId("crash-history-table-tbody");
	}

	public get fairnessRolledCells(): Locator {
		return this.page.locator(
			'[data-testid^="crash-history-table-cell-"][data-testid$="_rolled"]',
		);
	}
}
