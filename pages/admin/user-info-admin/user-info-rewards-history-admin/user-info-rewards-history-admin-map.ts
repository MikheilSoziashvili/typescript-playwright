import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class UserInfoRewardsHistoryAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get rewardsHistoryTable(): Locator {
		return this.page.locator("table");
	}

	public get rewardsHistoryTableColumn(): Locator {
		return this.rewardsHistoryTable.locator("thead th");
	}

	public get rewardsHistoryTableRows(): Locator {
		return this.rewardsHistoryTable.locator("tbody tr");
	}

	public targetRow(source: string, type: string): Locator {
		return this.rewardsHistoryTableRows
			.filter({ has: this.page.locator("td", { hasText: source }) })
			.filter({ has: this.page.locator("td", { hasText: type }) });
	}

	public rewardAmountInRow(source: string, type: string): Locator {
		return this.targetRow(source, type).locator("td").nth(4);
	}

	public rewardStatusInRow(source: string, type: string): Locator {
		return this.targetRow(source, type).locator("td").nth(7);
	}
}
