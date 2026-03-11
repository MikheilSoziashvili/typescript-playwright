import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class LimboGamePageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get betAmountInput(): Locator {
		return this.page.getByTestId("originals-bet-amount");
	}

	public get multiplierContainer(): Locator {
		return this.page.locator('div[class*="OddsInputsstyled__Base-Limbo"]');
	}

	public get multiplierInput(): Locator {
		return this.multiplierContainer.locator("input");
	}

	public get rollButton(): Locator {
		return this.page.locator(
			'button[class*="BetButtonstyled__Button-Limbo"]',
		);
	}

	public get historyTrack(): Locator {
		return this.page.locator(
			'div[class*="Historystyled__Track-Limbo"]',
		);
	}

	public get historyChips(): Locator {
		return this.historyTrack.locator(
			'button[class*="MultiplierChipstyled__Chip-Limbo"]',
		);
	}

	public get lastHistoryChip(): Locator {
		return this.historyChips.first();
	}

	public get lastHistoryChipValue(): Locator {
		return this.lastHistoryChip.locator(
			'span[class*="MultiplierChipstyled__Span-Limbo"]',
		);
	}
}
