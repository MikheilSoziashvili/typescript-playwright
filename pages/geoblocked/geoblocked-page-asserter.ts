import { expect } from "@playwright/test";
import { BaseAsserter } from "@base/base-asserter";
import { GeoblockedPage } from "./geoblocked-page";
import { GeoblockedCountry } from "@enums/geoblocked-countries";

export class GeoblockedPageAsserter extends BaseAsserter<GeoblockedPage> {
	public constructor(page: GeoblockedPage) {
		super(page);
	}

	public async isGeoblockedErrorTitleDisplayed(): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.errorTitleLocator)
			.toHaveText("Gamdom is not available in your Country");
	}

	public async isBlockedCountryNameDisplayed(
		countryName: GeoblockedCountry,
	): Promise<void> {
		await expect
			.soft(this.gamdomPage.map.errorSubTitleLocator)
			.toHaveText(countryName);
	}
}
