import { BaseAsserter } from "@base/base-asserter";
import { VerificationPage } from "./verification-page";
import { getItemsAttribute } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import type { FieldValidationScenario } from "test-data/interfaces/domain";

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

	@step("Validate error message for field")
	public async validateErrorMessageForField(
		fieldLabel: string,
		expectedErrorMessage: string,
	): Promise<void> {
		const errorLocator =
			this.gamdomPage.map.getErrorMessageForField(fieldLabel);

		if (expectedErrorMessage) {
			await this.checkElementsAreVisible([errorLocator]);
			await this.checkElementsHaveText([
				{ locator: errorLocator, expectedText: expectedErrorMessage },
			]);
		} else {
			await this.checkElementsAreHidden([errorLocator]);
		}
	}

	@step("Checkbox validation message is displayed")
	public async checkboxValidationMessageIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.checkboxValidationMessage,
		]);
	}

	@step("Fields are cleared")
	public async fieldsAreCleared(
		validations: FieldValidationScenario[],
	): Promise<void> {
		const fieldsToCheck = validations.map((v) => ({
			locator: this.gamdomPage.page.getByLabel(v.inputField),
			expectedValue: "",
		}));
		await this.checkElementsHaveValue(fieldsToCheck);
	}

	@step("Verify that Veriff iFrame is visible")
	public async verifyThatVeriffIFrameIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.veriffIFrameElement,
		]);
	}

	@step("KYC Level Two Verification title is visible")
	public async kycLevelTwoVerificationTitleIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.kycLevelTwoVerificationTitle,
		]);
	}

	@step("KYC Level Three Verification header is visible")
	public async kycLevelThreeVerificationHeaderIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.levelThreeVerificationHeader,
		]);
	}
}
