import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { FreeSpinsActionCardTitle } from "@enums/admin/free-spins-action-card-title";

export class FreeSpinsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getFreeSpinsActionCard(locator: string, title: string): Locator {
		return this.page.locator(locator).locator(`//h4[text()='${title}']/..`);
	}

	public get findGameToGiveFreeSpinsCard(): Locator {
		return this.getFreeSpinsActionCard(
			"//h4[text()='Find a game to go give free spins']//parent::div[contains(@class,'MuiBox-root')]",
			FreeSpinsActionCardTitle.FIND_GAME_TO_GIVE_FREE_SPINS,
		);
	}

	public get findGameToGiveFreeSpinsCardGameField(): Locator {
		return this.findGameToGiveFreeSpinsCard.locator(
			"div.field_group div.MuiAutocomplete-inputRoot",
		);
	}

	public get findGameToGiveFreeSpinsCardGameTextInput(): Locator {
		return this.findGameToGiveFreeSpinsCardGameField.locator("input");
	}

	public get findGameToGiveFreeSpinsCardUserIdTextInput(): Locator {
		return this.findGameToGiveFreeSpinsCard
			.locator("div.field_group")
			.filter({
				has: this.page.locator(
					'span.placeholder_txt:text-is("USER ID")',
				),
			})
			.locator("input");
	}

	public get findGameToGiveFreeSpinsCardUserIdGetButton(): Locator {
		return this.findGameToGiveFreeSpinsCard.locator(
			'//button[normalize-space()="GET"]',
		);
	}

	public get gamesList(): Locator {
		return this.page.locator("div.MuiPopper-root ul[role=listbox]");
	}

	public getGameLocatorByTitle(title: string): Locator {
		return this.gamesList.locator(
			`ul li div[class*="OptionTitle"]:text-is("${title}")`,
		);
	}

	public get possibleSpinsCard(): Locator {
		return this.getFreeSpinsActionCard(
			"div.aff_col.aff_col--autoh.text_center.relative-cont",
			FreeSpinsActionCardTitle.POSSIBLE_SPINS,
		);
	}

	public get possibleSpinsTable(): Locator {
		return this.possibleSpinsCard.locator("table");
	}

	public getPossibleSpinsTableRowByIndex(rowIndex: number): Locator {
		return this.possibleSpinsTable.locator("tbody tr").nth(rowIndex);
	}

	public getPossibleSpinsTableBetCountTextInput(rowIndex: number): Locator {
		return this.getPossibleSpinsTableRowByIndex(rowIndex).locator(
			'td input[placeholder="Enter bet amount"]',
		);
	}

	public getPossibleSpinsTableBetCountGiveButton(rowIndex: number): Locator {
		return this.getPossibleSpinsTableRowByIndex(rowIndex).locator(
			'td button:text-is("Give")',
		);
	}
}
