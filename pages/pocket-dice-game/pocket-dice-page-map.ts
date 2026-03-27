import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "@playwright/test";

export class PocketDiceMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get betAmountInput(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get numberSlider(): Locator {
		return this.page.getByRole("slider").first();
	}

	public get selectedNumberValue(): Locator {
		return this.page.locator("[class*='NumberRangestyled__RangeValue']");
	}

	public get rollUnderButton(): Locator {
		return this.page.getByRole("button", { name: "Under" });
	}

	public get rollOverButton(): Locator {
		return this.page.getByRole("button", { name: "Over" });
	}

	public get multiplierValue(): Locator {
		return this.page.locator("[class*='Multiplierstyled__LabelValue']");
	}

	public get rollButton(): Locator {
		return this.page.getByRole("button", { name: "Roll" });
	}

	public get autobetTab(): Locator {
		return this.page.getByRole("button", { name: "auto" });
	}

	public get autobetsCountInput(): Locator {
		return this.page.getByTestId("mines-autobet-bets-count");
	}

	public get increaseByOnWin(): Locator {
		return this.page
			.getByText("On win increase by:")
			.locator("xpath=following-sibling::*//input")
			.first();
	}

	public get increaseByOnLoss(): Locator {
		return this.page
			.getByText("On loss increase by:")
			.locator("xpath=following-sibling::*//input")
			.first();
	}

	public get startAutobetButton(): Locator {
		return this.page.getByRole("button", { name: "Start playing" });
	}

	public get betAmountOptions(): Locator {
		return this.page.locator(
			"div[class*='BetAmountInputstyled__Options-PocketDice']",
		);
	}

	public get minButton(): Locator {
		return this.betAmountOptions.getByRole("button", { name: "Min" });
	}

	public get takeButton(): Locator {
		return this.page.getByRole("button", { name: "Take" });
	}

	public get riskButton(): Locator {
		return this.page.getByRole("button", { name: "Risk" });
	}

	public get winBanner(): Locator {
		return this.page.locator(
			"[class*='ResultBannerstyled__Base-PocketDice']",
		);
	}
}
