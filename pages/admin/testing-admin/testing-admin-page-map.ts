import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class TestingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get testingAffilsContainer(): Locator {
		return this.page.getByTestId("testing-affils-container");
	}

	public get testingAffilsForceCalculationsButtonsContainer(): Locator {
		return this.page.getByTestId(
			"testing-affils-force-calc-buttons-container",
		);
	}

	public get mockDateButton(): Locator {
		return this.testingAffilsContainer.getByTestId(
			"testing-affils-mock-date-button",
		);
	}
}
