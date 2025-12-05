import { BaseAsserter } from "@base/base-asserter";
import { PromotionTestData } from "@dtos/test-data";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";
import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { PromotionsModal } from "./promotions-modal";
import {
	dropdownNormalizedPattern,
	normalizeDropdownValue,
} from "@support/regex-patterns";

export class PromotionsModalAsserter extends BaseAsserter<PromotionsModal> {
	public constructor(page: PromotionsModal) {
		super(page);
	}

	@step("Verify promotion button text input error message presence")
	public async promotionButtonTextInputErrorMessagePresence(
		expectedPresence: boolean,
	): Promise<void> {
		const buttonClassAttribute =
			await this.gamdomPage.map.promotionsModalButtonTextInputContainer.getAttribute(
				Attributes.CLASS,
			);
		const isErrorMessagePresent =
			buttonClassAttribute?.includes(AttributesValues.ERROR) ?? false;
		expect(isErrorMessagePresent).toBe(expectedPresence);
	}

	@step("Verify promotion delete confirmation modal is displayed")
	public async promotionDeleteConfirmationModalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.confirmDeletePromotionModal,
		]);
	}

	@step("Verify promotion delete confirmation modal is not displayed")
	public async promotionDeleteConfirmationModalIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.confirmDeletePromotionModal,
		]);
	}

	@step("Promotion has loaded")
	public async promotionHasLoaded(promotionTitle: string): Promise<void> {
		await this.checkElementsHaveValue([
			{
				locator: this.gamdomPage.map.promotionsModalTitleInput,
				expectedValue: promotionTitle,
			},
		]);
	}

	@step("Duplicate promotion modal has loaded")
	public async duplicatePromotionHasLoaded(
		promotionName: string,
		customUrl: string,
		promotionDefaultData: string,
		expectedPromotionData: PromotionTestData,
	): Promise<void> {
		await this.verifyBasicFields(
			promotionName,
			customUrl,
			expectedPromotionData,
		);
		await this.verifyDateTimeFields(
			expectedPromotionData,
			promotionDefaultData,
		);
		await this.verifyTextAreaFields(expectedPromotionData);
		await this.verifyDropdownFields(expectedPromotionData);
	}

	@step("Verify basic fields")
	private async verifyBasicFields(
		promotionName: string,
		customUrl: string,
		expectedData: PromotionTestData,
	): Promise<void> {
		const fields = [
			{
				locator: this.gamdomPage.map.promotionsModalTitleInput,
				expectedValue: promotionName,
			},
			{
				locator: this.gamdomPage.map.promotionsModalCustomUrlInput,
				expectedValue: customUrl,
			},
			{
				locator: this.gamdomPage.map.promotionsModalPriorityInput,
				expectedValue: expectedData.priority.toString(),
			},
			{
				locator:
					this.gamdomPage.map.promotionsModalShortDescriptionInput,
				expectedValue: expectedData.shortDescription,
			},
			{
				locator: this.gamdomPage.map.promotionsModalButtonTextInput,
				expectedValue: expectedData.buttonText,
			},
			{
				locator: this.gamdomPage.map.promotionsModalButtonLinkInput,
				expectedValue: expectedData.buttonLink,
			},
		];
		await this.checkElementsHaveValue(fields);
	}

	@step("Verify date and time fields")
	private async verifyDateTimeFields(
		expectedData: PromotionTestData,
		defaultTime: string,
	): Promise<void> {
		const fields = [
			{
				locator: this.gamdomPage.map.promotionsModalStartDateInput,
				expectedValue:
					expectedData.promotionStartDate?.toString() ?? "",
			},
			{
				locator: this.gamdomPage.map.promotionsModalEndDateInput,
				expectedValue: expectedData.promotionEndDate?.toString() ?? "",
			},
			{
				locator: this.gamdomPage.map.promotionsModalStartTimeInput,
				expectedValue: defaultTime,
			},
			{
				locator: this.gamdomPage.map.promotionsModalEndTimeInput,
				expectedValue: defaultTime,
			},
		];
		await this.checkElementsHaveValue(fields);
	}

	@step("Verify text area fields")
	private async verifyTextAreaFields(
		expectedData: PromotionTestData,
	): Promise<void> {
		const fields = [
			{
				locator:
					this.gamdomPage.map.promotionsModalDetailedDescriptionInput,
				expectedValue: expectedData.detailedDescription,
			},
			{
				locator:
					this.gamdomPage.map.promotionsModalTermsAndConditionsInput,
				expectedValue: expectedData.termsAndConditions,
			},
			{
				locator:
					this.gamdomPage.map.promotionsModalHowToParticipateInput,
				expectedValue: expectedData.howToParticipate,
			},
			{
				locator:
					this.gamdomPage.map.promotionsModalPrizesDescriptionInput,
				expectedValue: expectedData.prizesDescription,
			},
		];

		for (const { locator, expectedValue } of fields) {
			await this.assertTextAreaValue(locator, expectedValue);
		}
	}

	@step("Verify dropdown fields")
	private async verifyDropdownFields(
		expectedData: PromotionTestData,
	): Promise<void> {
		const dropdowns = [
			{
				locator:
					this.gamdomPage.map
						.promotionsModalPromotionCategoryDropdown,
				expectedValue: expectedData.promotionCategory,
			},
			{
				locator:
					this.gamdomPage.map
						.promotionsModalPromotionSubCategoryDropdown,
				expectedValue: expectedData.promotionSubCategory,
			},
			{
				locator: this.gamdomPage.map.promotionsModalIsForVipDropdown,
				expectedValue: expectedData.isForVip,
			},
		];

		for (const { locator, expectedValue } of dropdowns) {
			await this.assertDropdownValue(locator, expectedValue);
		}
	}

	@step("Assert dropdown value")
	private async assertDropdownValue(
		dropdown: Locator,
		expected: string | undefined,
	): Promise<void> {
		const actual = (await dropdown.textContent())?.trim() ?? "";

		const actualNormalized = normalizeDropdownValue(actual);

		expect(actualNormalized).toMatch(
			dropdownNormalizedPattern(expected ?? ""),
		);
	}

	@step("Assert text area value")
	private async assertTextAreaValue(
		locator: Locator,
		expected: string,
	): Promise<void> {
		await expect(locator).toHaveText(expected.trim());
	}
}
