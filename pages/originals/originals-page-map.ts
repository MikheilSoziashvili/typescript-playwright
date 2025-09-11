import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class OriginalsMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get liveBetsTab(): Locator {
		return this.page.getByLabel("live bets tab");
	}

	public get liveBetsTable(): Locator {
		return this.page.locator('table[aria-label="live bets table"]').first();
	}

	public get allBetRows(): Locator {
		return this.liveBetsTable.locator("tbody tr");
	}

	public getBetRowByUserAndGame(username: string, gameName: string): Locator {
		return this.allBetRows
			.filter({
				has: this.page.locator("td").filter({ hasText: username }),
			})
			.filter({
				has: this.page.locator("td").filter({ hasText: gameName }),
			});
	}

	public getGameCell(row: Locator): Locator {
		return row.locator("td").nth(0);
	}

	public getUserCell(row: Locator): Locator {
		return row.locator("td").nth(1);
	}

	public getTimeCell(row: Locator): Locator {
		return row.locator("td").nth(2);
	}

	public getBetCell(row: Locator): Locator {
		return row.locator("td").nth(3);
	}

	public getMultiplierCell(row: Locator): Locator {
		return row.locator("td").nth(4);
	}

	public getPayoutCell(row: Locator): Locator {
		return row.locator("td").nth(5);
	}

	public get howToPlayTooltip(): Locator {
		return this.page.locator('button[data-tooltip="How to play?"]');
	}

	public get howToPlayModal(): Locator {
		return this.page.locator('div[class*="Layoutstyled__Root"]');
	}

	public get howToPlayModalSliderCounter(): Locator {
		return this.howToPlayModal.locator(
			'span[class*="ModalHowstyled__SlidesCounter"]',
		);
	}

	public get howToPlayModalNextButton(): Locator {
		return this.howToPlayModal.getByRole("button", { name: "Next" });
	}
}
