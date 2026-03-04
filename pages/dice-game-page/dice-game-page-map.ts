import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { BetIncreaseCondition } from "@enums/dice-autobet-section-name";

export class DiceGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get diceGameAreaMessage(): Locator {
		return this.page
			.getByTestId("diceGameAreaContainer")
			.locator("div[class*='DiceGameArea-styled__DrawStyledBox-sc']");
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
		return this.page.getByTestId("dice-auto-tab");
	}

	public get diceHistoryResultsModal(): Locator {
		return this.page.locator('div[class*="Modal-styled_"]');
	}

	public get autobetYourBetInput(): Locator {
		return this.page.getByTestId("dice-your-bet-auto-input");
	}

	public get autobetRollOverInput(): Locator {
		return this.page.getByTestId("dice-roll-over-auto-input");
	}

	public get autobetNbOfBetsInput(): Locator {
		return this.page.getByTestId("dice-number-of-bets-input");
	}

	public get autobetStopOnProfitInput(): Locator {
		return this.page.getByTestId("dice-stop-on-profit-input");
	}

	public get autobetStopOnLossInput(): Locator {
		return this.page.getByTestId("dice-stop-on-loss-input");
	}

	public get startAutobetButton(): Locator {
		return this.page.getByTestId("dice-toggle-autobet-btn");
	}

	public get stopAutobetButton(): Locator {
		return this.page.locator(
			'button[data-testid="dice-toggle-autobet-btn"]',
			{
				hasText: "Stop Autobet",
			},
		);
	}

	public get betMenu(): Locator {
		return this.page.locator('div[class*="GameBox"][class*="MuiBox-root"]');
	}

	public getIncreaseBySelectButton(type: BetIncreaseCondition): Locator {
		return this.page.getByTestId(`dice-on-${type}-select-button`);
	}

	public getIncreaseByOption(type: BetIncreaseCondition): Locator {
		return this.page.getByTestId(`dice-on-${type}-select-option-multiply`);
	}

	public getIncreaseByPercentInput(type: BetIncreaseCondition): Locator {
		return this.page.getByTestId(`dice-on-${type}-percent`);
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
			.getByTestId("diceSliderBar")
			.locator("input[type='range']");
	}

	public get diceResultNumberGameArea(): Locator {
		return this.page
			.getByTestId("diceSlider")
			.locator("div[class*='DiceSlider-styled__SliderPinResultNumber-sc']")
			.first();
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

	public get gameDescriptionToggleButton(): Locator {
		return this.page.getByTestId("game-description-header-toggle-button");
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
