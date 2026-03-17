import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";

export class CrashGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get gameContainer(): Locator {
		return this.page.locator("#chart-inner-container");
	}

	public get multiplierCounterProgressing(): Locator {
		return this.page.getByTestId("crashInProgressState");
	}

	public get multiplierCounterCrashed(): Locator {
		return this.page.getByTestId("crashStateCrashed");
	}

	public get spinningCountdownCounter(): Locator {
		return this.page.getByTestId("crashSpinningCountdownCounter");
	}

	public get betField(): Locator {
		return this.page.getByRole("textbox", { name: "Bet amount" });
	}

	public get autoCashOutField(): Locator {
		return this.page.getByTestId("crashCashOutInput-input");
	}

	public get placeBetBtn(): Locator {
		return this.page.getByTestId("crashPlayButton");
	}

	public get betBox(): Locator {
		return this.page.locator("[class*='UserBets-styled__Wrapper-sc-']");
	}

	public get betItemYourBetInput(): Locator {
		return this.page.getByTestId("crashSingleBetItemYourBet-input");
	}

	public get betItemButton(): Locator {
		return this.page.getByTestId("crashSingleBetItemButton");
	}

	public get betItemPotential(): Locator {
		return this.page.getByTestId("crashSingleBetItemPotential");
	}

	public get statsTableBody(): Locator {
		return this.page.getByTestId("game-stats-area-grid-tbody");
	}

	// Autobet locators
	public get autoPlayBtn(): Locator {
		return this.page.getByTestId("crashAutoPlayButton");
	}

	public get autobetToggle(): Locator {
		return this.page
			.getByTestId("crashAutoBetLabel")
			.locator("xpath=following-sibling::label");
	}

	public get stopBetIfMoreThanField(): Locator {
		return this.page.getByRole("textbox", {
			name: "Stop if bet is more than",
		});
	}

	public getOnConditionSelectButton(type: BetIncreaseCondition): Locator {
		return this.page.getByTestId(
			`crashOn${type === BetIncreaseCondition.WIN ? "Win" : "Loss"}Select-button`,
		);
	}

	public getOnConditionOption(
		type: BetIncreaseCondition,
		option: "Ret" | "Inc",
	): Locator {
		return this.page.getByTestId(
			`crashOn${type === BetIncreaseCondition.WIN ? "Win" : "Loss"}Select-option-${option}`,
		);
	}

	public getIncreaseByInput(type: BetIncreaseCondition): Locator {
		return this.page.getByTestId(
			`crashOnWinAutoBetMultiplierOn${type === BetIncreaseCondition.WIN ? "Win" : "Loss"}-Input`,
		);
	}
}
