import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class FreeSpinsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get findGameToGiveFreeSpinsCard(): Locator {
		return this.page.getByTestId("findGameToGiveFreeSpinsContainer");
	}

	public get findGameToGiveFreeSpinsCardGameField(): Locator {
		return this.findGameToGiveFreeSpinsCard.locator(
			"div.MuiAutocomplete-inputRoot",
		);
	}

	public get findGameToGiveFreeSpinsCardGameTextInput(): Locator {
		return this.findGameToGiveFreeSpinsCardGameField.locator("input");
	}

	public get findGameToGiveFreeSpinsCardUserIdTextInput(): Locator {
		return this.findGameToGiveFreeSpinsCard.getByTestId("userIdInputField");
	}

	public get findGameToGiveFreeSpinsCardUserIdGetButton(): Locator {
		return this.findGameToGiveFreeSpinsCard.getByTestId("getButton");
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
		return this.page.getByTestId("possibleSpinsContainer");
	}

	public get possibleSpinsTable(): Locator {
		return this.possibleSpinsCard.getByTestId(
			"possibleSpinsTableContainer",
		);
	}

	public getPossibleSpinsTableRowByIndex(rowIndex: number): Locator {
		return this.possibleSpinsTable
			.getByTestId("possibleSpinsTableBody")
			.getByTestId("possibleSpinsTableRow")
			.nth(rowIndex);
	}

	public getPossibleSpinsTableBetCountTextInput(rowIndex: number): Locator {
		return this.getPossibleSpinsTableRowByIndex(rowIndex)
			.getByTestId("betAmountCell")
			.getByTestId("betAmountInput");
	}

	public getPossibleSpinsTableBetCountGiveButton(rowIndex: number): Locator {
		return this.getPossibleSpinsTableRowByIndex(rowIndex)
			.getByTestId("buttonCell")
			.getByTestId("giveButton");
	}

	public get batchModeCheckbox(): Locator {
		return this.page.getByTestId("batchModeCheckbox");
	}

	public get inputFileBatchFreeSpins(): Locator {
		return this.findGameToGiveFreeSpinsCard.locator(`input[type="file"]`);
	}

	public get freeSpinsOfUserContainer(): Locator {
		return this.page.getByTestId("getFreespinsOfUserContainer");
	}

	public get getFreeSpinsOfUser(): Locator {
		return this.freeSpinsOfUserContainer.getByTestId("getButton");
	}

	public get freeSpinsActionButton(): Locator {
		return this.page.locator("td.clickable").locator("button");
	}
}
