import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { VipManagerActionCardTitle } from "@enums/admin/vip-manager-action-card-title";

export class VipManagerAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public getVipManagerActionCard(title: string): Locator {
		return this.page
			.locator("div.aff_col")
			.filter({ has: this.page.locator(`h4.title:text-is("${title}")`) });
	}

	public get findGameToGiveFreeSpinsCard(): Locator {
		return this.getVipManagerActionCard(
			VipManagerActionCardTitle.FIND_GAME_TO_GIVE_FREE_SPINS,
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
			'button.btn_green:text-is("GET")',
		);
	}

	public get gamesList(): Locator {
		return this.page.locator("div.base-Popper-root ul[role=listbox]");
	}

	public getGameLocatorByTitle(title: string): Locator {
		return this.gamesList.locator(
			`ul li div[class*="OptionTitle"]:text-is("${title}")`,
		);
	}

	public get possibleSpinsCard(): Locator {
		return this.getVipManagerActionCard(
			VipManagerActionCardTitle.POSSIBLE_SPINS,
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
