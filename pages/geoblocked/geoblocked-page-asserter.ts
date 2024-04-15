import { expect } from "@playwright/test";
import { BaseAsserter } from "../base/base-asserter";
import { GeoblockedPage } from "./geoblocked-page";
import { GeoblockedCountries } from "../../enums/geoblocked-countries";

export class GeoblockedPageAsserter extends BaseAsserter<GeoblockedPage> {
	public constructor(page: GeoblockedPage) {
		super(page);
	}

	public async isGeoblockedErrorTitleDisplayed(): Promise<void> {
		await expect(this.gamdomPage.map.errorTitleLocator).toHaveText(
			"Gamdom is not available in your Country",
		);
	}

	public async isBlockedCountryNameDisplayed(
		countryName: GeoblockedCountries,
	): Promise<void> {
		await expect(this.gamdomPage.map.errorSubTitleLocator).toHaveText(
			countryName,
		);
	}
}
