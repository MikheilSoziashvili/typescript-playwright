import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";
import { digitsOnlyPattern } from "@support/regex-patterns";

export class FreeSpinsAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get findGameToGiveFreeSpinsCard(): Locator {
		return this.page.getByTestId("findGameToGiveFreeSpinsContainer");
	}

	public get getTopPlayedSlotsContainer(): Locator {
		return this.page.getByTestId("getTopPlayedSlotsContainer");
	}

	public get topPlayedSlotsContainer(): Locator {
		return this.page.getByTestId("topPlayedSlotsContainer");
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

	public get getTopPlayedSlotsInputField(): Locator {
		return this.getTopPlayedSlotsContainer.getByTestId("inputField");
	}

	public get getTopPlayedSlotsGetButton(): Locator {
		return this.getTopPlayedSlotsContainer.getByTestId("getButton");
	}

	public get topPlayedSlotsTable(): Locator {
		return this.topPlayedSlotsContainer.locator("div.table table");
	}

	public get topPlayedSlotsVisibleRows(): Locator {
		return this.topPlayedSlotsTable.locator("tbody tr:visible");
	}

	public getTopPlayedSlotsRowByGameName(gameName: string): Locator {
		return this.topPlayedSlotsVisibleRows.filter({
			has: this.page.locator("td:nth-child(2)", { hasText: gameName }),
		});
	}

	public get batchFreeSpinsPopUpContainer(): Locator {
		return this.page.getByTestId("modalContainer");
	}

	public async getBatchFreeSpinsPopUpSuccessfulUsersCount(): Promise<number> {
		const text = await this.batchFreeSpinsPopUpContainer
			.getByText("Successfully received:")
			.innerText();
		return Number(text.match(digitsOnlyPattern)?.[0]);
	}

	public async getBatchFreeSpinsPopUpFailedUsersCount(): Promise<number> {
		const text = await this.batchFreeSpinsPopUpContainer
			.getByText("Failed:")
			.innerText();
		return Number(text.match(digitsOnlyPattern)?.[0]);
	}

	public async getBatchFreeSpinsPopUpTotalProcessedUsersCount(): Promise<number> {
		const text = await this.batchFreeSpinsPopUpContainer
			.getByText("Total processed:")
			.innerText();
		return Number(text.match(digitsOnlyPattern)?.[0]);
	}
}
