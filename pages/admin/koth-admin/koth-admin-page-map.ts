import { KothEventDuration } from "@enums/admin/koth-event-duration";
import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class KothAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get kothAdminPageContent(): Locator {
		return this.page.getByTestId("adminKothPageContent");
	}

	public get kothAdminPanelTitle(): Locator {
		return this.kothAdminPageContent.getByTestId("headerTitle");
	}

	public get kothAdminPanelSubtitle(): Locator {
		return this.kothAdminPageContent.getByTestId("headerSubtitle");
	}

	public get startEventDateInput(): Locator {
		return this.getTableCellInput(
			"Start Date (local time)",
			'input[type="text"][class="form-control"]',
		);
	}

	public get endEventDateInput(): Locator {
		return this.getTableCellInput(
			"End Date (local time)",
			'input[type="text"][class="form-control"]',
		);
	}

	public endEventDateButton(days: KothEventDuration): Locator {
		return this.getTableCellButton("End Date (local time)", days);
	}

	public get maxUsersInput(): Locator {
		return this.getTableCellInput(
			"Max Winners",
			'input[placeholder="Amount of users"]',
		);
	}

	public get prizeInput(): Locator {
		return this.getTableCellInput(
			"Prize (USD)",
			'input[placeholder="Amount in USD"]',
		);
	}

	public get gamesSearchInput(): Locator {
		return this.getTableCellInput(
			"Game (optional)",
			'[data-testid="searchInputFieldContainer"] input[type="text"]',
		);
	}

	public get eventNameInput(): Locator {
		return this.getTableCellInput(
			"Event name",
			'input[placeholder="Event name"]',
		);
	}

	public get startEventButton(): Locator {
		return this.page.locator("button", { hasText: "Start event" });
	}

	public get confirmStartEventButton(): Locator {
		return this.page
			.locator("div")
			.filter({ hasText: "Confirm Start" })
			.getByRole("button", { name: "Start" });
	}

	public getKothEventRow(eventName: string): Locator {
		return this.page.locator("tr").filter({
			has: this.page.locator("td").filter({ hasText: eventName }),
		});
	}

	public getEventEndDate(eventName: string): Locator {
		return this.getKothEventRow(eventName).locator("td").nth(0);
	}

	public getEventPrize(eventName: string): Locator {
		return this.getKothEventRow(eventName).locator("td").nth(1);
	}

	public getMaxWinners(eventName: string): Locator {
		return this.getKothEventRow(eventName).locator("td").nth(2);
	}

	public getGame(eventName: string): Locator {
		return this.getKothEventRow(eventName).locator("td").nth(3);
	}

	public getEventName(eventName: string): Locator {
		return this.getKothEventRow(eventName).locator("td").nth(4);
	}
}
