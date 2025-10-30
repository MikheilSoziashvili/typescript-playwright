import { BaseAsserter } from "@base/base-asserter";
import { VerificationPage } from "./verification-page";
import { expect } from "@playwright/test";
import { getItemsAttribute } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { step } from "decorators/step";

export class VerificationPageAsserter extends BaseAsserter<VerificationPage> {
	public constructor(page: VerificationPage) {
		super(page);
	}

	@step("Country dropdown values not contains items")
	public async countryDropdownValuesNotContainsItems(
		expectedMissingItems: string[],
	): Promise<void> {
		const actualCountries = await getItemsAttribute(
			this.gamdomPage.map.countryDropdownValueItems,
			Attributes.DATA_VALUE,
		);
		const commonValues = expectedMissingItems.filter((value) =>
			actualCountries.includes(value),
		);

		expect(
			commonValues,
			`Unexpected common values found: ${commonValues.join(", ")}`,
		).toHaveLength(0);
	}

	@step("Verification page title is visible")
	public async verificationPageTitleAndTabsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.verificationPageTitle,
			this.gamdomPage.map.verifyMeTab,
			this.gamdomPage.map.verifyBusinessTab,
		]);
	}
}
