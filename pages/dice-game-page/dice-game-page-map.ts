import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { DiceAutobetSectionName } from "@enums/dice-autobet-section-name";

export class DiceGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get manualYourBetContainer(): Locator {
		return this.page.getByTestId("diceYourBetContainer");
	}

	public get manualBetField(): Locator {
		return this.manualYourBetContainer.locator("input");
	}

	public get manualProfitOnWinContainer(): Locator {
		return this.page.getByTestId("diceProfitOnWinContainer");
	}

	public get manualProfitOnWinField(): Locator {
		return this.manualProfitOnWinContainer.locator("input");
	}

	public get manualMultiplierContainer(): Locator {
		return this.page.getByTestId("diceRollMultiplierContainer");
	}

	public get manualMultiplierField(): Locator {
		return this.manualMultiplierContainer.locator("input");
	}

	public get manualRollOverContainer(): Locator {
		return this.page.getByTestId("diceRollOverContainer");
	}

	public get manualRollOverField(): Locator {
		return this.manualRollOverContainer.locator("input");
	}

	public get manualWinChanceContainer(): Locator {
		return this.page.getByTestId("diceRollWinChanceContainer");
	}

	public get manualWinChanceField(): Locator {
		return this.manualWinChanceContainer.locator("input");
	}

	public get rollDiceBtn(): Locator {
		return this.page.getByTestId("rollDiceBtn");
	}

	public get diceSliderValue(): Locator {
		return this.page.locator("span[class*='MuiSlider-valueLabelLabel']");
	}

	public get diceGameAreaMessage(): Locator {
		return this.page.getByTestId("diceGameAreaMessage");
	}

	public get diceResultNumberGameArea(): Locator {
		return this.page.getByTestId("diceResult");
	}

	public get diceResultsHistory(): Locator {
		return this.page.getByTestId("diceRollHistoryResults");
	}

	public get diceRollHistoryContainer(): Locator {
		return this.page.getByTestId("diceRollHistoryContainer");
	}

	public get diceRollHistoryButton(): Locator {
		return this.diceRollHistoryContainer.locator("img");
	}

	public get diceLastResultNumber(): Locator {
		return this.diceResultsHistory.locator("div").first();
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
		return this.autobetContainer.locator("button span", {
			hasText: "Start Autobet",
		});
	}

	public get stopAutobetButton(): Locator {
		return this.autobetContainer.locator("button span", {
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
}
