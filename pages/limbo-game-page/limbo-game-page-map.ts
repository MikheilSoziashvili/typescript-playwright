import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class LimboGamePageMap extends BaseMap {
	private readonly BET_BUTTON =
		'button[class*="BetButtonstyled__Button-Limbo"]';

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

	public get betAmountOptions(): Locator {
		return this.page.locator(
			"div[class*='BetAmountInputstyled__Options-Limbo']",
		);
	}

	public get minButton(): Locator {
		return this.betAmountOptions.getByRole("button", { name: "Min" });
	}

	public get rollButton(): Locator {
		return this.page.locator(this.BET_BUTTON);
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

	public get autoRollSwitch(): Locator {
		return this.page.locator(
			'button[class*="Switchstyled__Button-Limbo"]',
		);
	}

	public get startPlayingButton(): Locator {
		return this.page.locator(this.BET_BUTTON, {
			hasText: "Start playing",
		});
	}

	public get stopPlayingButton(): Locator {
		return this.page.locator(this.BET_BUTTON, {
			hasText: "Stop playing",
		});
	}

	public get autobetFinishedToast(): Locator {
		return this.page.getByTestId("Autobet Finished-toast");
	}

	public get autobetFinishedToastTitle(): Locator {
		return this.page.getByTestId("Success!-toast-title");
	}

	public get autobetFinishedToastSubTitle(): Locator {
		return this.page.getByTestId("Autobet Finished-toast-subtitle");
	}
}
