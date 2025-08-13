import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class EvRewardsSystemAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get bulkRewardsUploadButton(): Locator {
		return this.page.locator('span:text-is("Bulk Rewards Upload")');
	}

	public get rewardTypeDropdown(): Locator {
		return this.page.getByTestId("Label");
	}

	public get evRewardOption(): Locator {
		return this.rewardTypeDropdown.getByText("ev_reward");
	}

	public get periodDropdown(): Locator {
		return this.page.getByLabel(`Period Type`);
	}

	public periodTypeOption(periodType: string): Locator {
		return this.periodDropdown.getByText(periodType);
	}

	public get periodIdentifierDropdown(): Locator {
		return this.page.getByLabel(`Period Identifier`);
	}

	public get getPeriodIdentifierOption(): Locator {
		return this.page.getByTestId("ListContainer").locator(`ul > li`);
	}
}
