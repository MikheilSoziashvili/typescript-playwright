import { BasePage } from "@base/base-page";
import { VERIFICATION_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { VerificationPageAsserter } from "./verification-page-asserter";
import { VerificationPageMap } from "./verification-page-map";
import { VerificationPageSteps } from "./verification-page-steps";
import { getItemsAttribute, getRandomIndex } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import { VerificationTabType } from "@enums/verification-enums";
import { faker } from "@faker-js/faker";
import {
	KYC_FIELDS,
	RANDOM_COUNTRY,
} from "test-data/domains/verification-domain-data";
import { FieldValidationScenario } from "test-data/interfaces";
import { VeriffApi } from "@api/veriff-api";
import * as Configuration from "../../configuration";
import { testData } from "test-data/test-data-manager";

export class VerificationPage extends BasePage<VerificationPageMap> {
	public constructor(page: Page) {
		super(page, new VerificationPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [VERIFICATION_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): VerificationPageAsserter {
		return new VerificationPageAsserter(this);
	}

	public steps(): VerificationPageSteps {
		return new VerificationPageSteps(this);
	}

	@step("Select Verify Business tab")
	public async selectVerifyBusinessTab(): Promise<void> {
		await this.map.verifyBusinessTab.click();
	}

	@step("Open country dropdown")
	public async openCountryDropdown(): Promise<void> {
		await this.map.countryDropdown.click();
	}

	@step("Get country dropdown values")
	public async getCountryDropdownValues(): Promise<string[]> {
		const countryDropdownValues = await getItemsAttribute(
			this.map.countryDropdownValueItems,
			Attributes.DATA_VALUE,
		);
		return countryDropdownValues;
	}

	@step("Select random country from dropdown")
	public async selectRandomCountry(): Promise<void> {
		const options = this.page.locator('li[role="option"]');
		const count = await options.count();

		if (count === 0) {
			throw new Error("No countries available in dropdown");
		}

		const randomIndex = getRandomIndex(count);
		const selected = await options.nth(randomIndex).innerText();

		await options.nth(randomIndex).click();
		logger.info(`Selected country: ${selected}`);
	}

	@step("Clear field using clear button")
	public async clearFieldUsingClearButton(fieldLabel: string): Promise<void> {
		const clearButton = this.map.getClearButtonForField(fieldLabel);
		await clearButton.click();
	}

	@step("Toggle checkbox")
	public async toggleCheckbox(
		options: { count?: number } = {},
	): Promise<void> {
		const { count = 1 } = options;

		for (let i = 0; i < count; i++) {
			await this.map.verifyCheckbox.click();
		}
	}

	@step("Select verification tab")
	public async selectVerificationTab(
		tabType: VerificationTabType,
	): Promise<void> {
		if (tabType === VerificationTabType.VERIFY_BUSINESS) {
			await this.selectVerifyBusinessTab();
		}
	}

	@step("Fill in verification form for KYC level 1")
	public async fillInKycLevel1Form(): Promise<void> {
		await this.map.firstAndLastNameInput.fill(faker.person.fullName());
		await this.map.dateOfBirthInput.fill(
			faker.date.birthdate().toISOString().split("T")[0],
		);
		await this.map.countryDropdownContainer.click();
		await this.selectRandomCountry();
		await this.map.verifyCheckbox.click();
		await this.map.submitButton.click();
	}

	@step("Fill in verification form for KYB level 1")
	public async fillInKybLevel1Form(): Promise<void> {
		await this.selectVerifyBusinessTab();
		await this.map.businessNameInput.fill(faker.company.name());
		await this.map.bbusinessAddressInput.fill(
			faker.location.streetAddress(),
		);
		await this.map.businessRegistrationNumberInput.fill(
			faker.string.numeric(10),
		);
		await this.map.verifyCheckbox.click();
		await this.map.submitButton.click();
	}

	@step("Fill input and trigger validation")
	public async fillInputAndTriggerValidation(
		fieldLabel: string,
		value: string,
	): Promise<void> {
		if (fieldLabel === KYC_FIELDS.COUNTRY) {
			if (value === RANDOM_COUNTRY) {
				await this.map.countryDropdownContainer.click();
				await this.selectRandomCountry();
			} else {
				await this.map.countryDropdown.click();
				await this.map.countryDropdown.blur();
			}
			return;
		}

		const fieldLocator = this.page.getByLabel(fieldLabel);
		await fieldLocator.click();
		if (value) {
			await fieldLocator.fill(value);
		}
		await fieldLocator.blur();
	}

	@step("Clear fields using clear button")
	public async clearFieldsUsingClearButton(
		validations: FieldValidationScenario[],
	): Promise<void> {
		for (const { inputField, input } of validations) {
			await this.fillInputAndTriggerValidation(inputField, input);
			await this.clearFieldUsingClearButton(inputField);
		}
	}

	@step("Create session in Veriff API")
	public async createSessionInVeriffApi(
		veriffApi: VeriffApi,
		userId: string,
	): Promise<string> {
		const createSessionResponse = await veriffApi.createSession(
			Configuration.veriffConfig.callBackUrl,
			userId,
		);

		const sessionId = veriffApi.getSessionIdFromResponse(
			createSessionResponse,
		);
		return sessionId;
	}

	@step("Upload documents for verification")
	public async uploadDocumentsForVerification(
		veriffApi: VeriffApi,
		sessionId: string,
		documentContent: string,
	): Promise<void> {
		const testDataPredefined = testData()
			.fromPredefined()
			.pick({
				documentTypes: (data) => data.veriff.documentTypes,
			});
		const documentTypes = testDataPredefined.documentTypes;

		for (const documentType of documentTypes) {
			await veriffApi.uploadMedia(
				sessionId,
				documentType,
				documentContent,
			);
		}
	}

	@step("Submit verification session")
	public async submitVerificationSession(
		veriffApi: VeriffApi,
		sessionId: string,
	): Promise<void> {
		await veriffApi.submitSession(sessionId);
	}
}
