import { BasePage } from "@base/base-page";
import { VERIFICATION_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Locator, Page } from "@playwright/test";
import { VerificationPageAsserter } from "./verification-page-asserter";
import { VerificationPageMap } from "./verification-page-map";
import { VerificationPageSteps } from "./verification-page-steps";
import { extractDateParts } from "@core/utils/datetime-utils";
import {
	excludeHeaderFromHost,
	getISODate,
	getItemsAttribute,
	getRandomIndex,
} from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { step } from "decorators/step";
import { logger } from "@logger/logger";
import {
	KycLevels,
	ProofOfFunds,
	VerificationTabType,
} from "@enums/verification-enums";
import { faker } from "@faker-js/faker";
import {
	KYC_FIELDS,
	KYC_LEVEL_2_5_FIELDS,
	KYC_LEVEL_3_FIELDS,
	RANDOM_OPTION,
	VALIDATION_TRIGGER_CHAR,
} from "test-data/domains/verification-domain-data";
import { FieldValidationScenario } from "test-data/interfaces";
import { VeriffApi } from "@api/veriff-api";
import * as Configuration from "../../configuration";
import { testData } from "test-data/test-data-manager";
import { KYC_LEVEL_3_FILE_PATH } from "@constants/file-paths";
import { KeyboardKey } from "@enums/keyboard";

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
	public async openCountryDropdown(
		level: KycLevels = KycLevels.LEVEL_1,
	): Promise<void> {
		await this.map.countryDropdown(level).click();
	}

	@step("Get country dropdown values")
	public async getCountryDropdownValues(): Promise<string[]> {
		const countryDropdownValues = await getItemsAttribute(
			this.map.countryDropdownValueItems,
			Attributes.DATA_VALUE,
		);
		return countryDropdownValues;
	}

	@step("Select random option from dropdown")
	public async selectRandomOption(): Promise<void> {
		const options = this.page.getByRole("option");
		const count = await options.count();

		if (count === 0) {
			throw new Error("No options available in dropdown");
		}

		const randomIndex = getRandomIndex(count);
		const selected = await options.nth(randomIndex).innerText();

		await options.nth(randomIndex).click();
		logger.info(`Selected option: ${selected}`);
	}

	@step("Clear field using clear button")
	public async clearFieldUsingClearButton(fieldLabel: string): Promise<void> {
		const clearButton = this.map.getClearButtonForField(fieldLabel);
		await clearButton.click();
	}

	@step("Toggle checkbox")
	public async toggleCheckbox(
		options: { count?: number; level?: KycLevels } = {},
	): Promise<void> {
		const { count = 1, level = KycLevels.LEVEL_1 } = options;

		for (let i = 0; i < count; i++) {
			await this.map.verifyCheckbox(level).click();
		}
	}

	@step("Select verification tab")
	public async selectVerificationTab(
		tabType: VerificationTabType,
	): Promise<void> {
		await this.map.kycLevelToggle(KycLevels.LEVEL_1).click();
		if (tabType === VerificationTabType.VERIFY_BUSINESS) {
			await this.selectVerifyBusinessTab();
		}
	}

	@step("Select date picker type dropdown option")
	private async selectDatePickerOption(
		button: Locator,
		option: Locator,
	): Promise<void> {
		await button.click();
		await option.click();
	}

	@step("Select date of birth")
	public async selectDateOfBirth(isoDate: string): Promise<void> {
		const { day, month, year } = extractDateParts(new Date(isoDate));

		await this.selectDatePickerOption(
			this.map.dateOfBirthDayButton,
			this.map.dateOfBirthDayOption(day),
		);
		await this.selectDatePickerOption(
			this.map.dateOfBirthMonthButton,
			this.map.dateOfBirthMonthOption(month),
		);
		await this.selectDatePickerOption(
			this.map.dateOfBirthYearButton,
			this.map.dateOfBirthYearOption(year),
		);
	}

	@step("Fill in verification form for KYC level 1")
	public async fillInKycLevel1Form(): Promise<void> {
		await this.map.kycLevelToggle(KycLevels.LEVEL_1).click();
		await this.map.firstAndLastNameInput.fill(faker.person.fullName());
		await this.selectDateOfBirth(
			getISODate({ yearsOffset: -25 }).split("T")[0],
		);
		await this.map.countryDropdownContainer(KycLevels.LEVEL_1).click();
		await this.selectRandomOption();
		await this.map.verifyCheckbox(KycLevels.LEVEL_1).click();
		await this.map.submitButton(KycLevels.LEVEL_1).click();
	}

	@step("Fill in verification form for KYC level 2.5")
	public async fillInKycLevel2_5Form(): Promise<void> {
		await this.map.countryDropdownContainer(KycLevels.LEVEL_2).click();
		await this.selectRandomOption();
		await this.map.reasonForResidenceDropdown(KycLevels.LEVEL_2).click();
		await this.selectRandomOption();
		await this.map.verifyCheckbox(KycLevels.LEVEL_2).click();
		await this.map.submitButton(KycLevels.LEVEL_2).click();
	}

	@step("Fill in verification form for KYB level 1")
	public async fillInKybLevel1Form(): Promise<void> {
		await this.map.kycLevelToggle(KycLevels.LEVEL_1).click();
		await this.selectVerifyBusinessTab();
		await this.map.businessNameInput.fill(faker.company.name());
		await this.map.businessAddressInput.fill(
			faker.location.streetAddress(),
		);
		await this.map.businessRegistrationNumberInput.fill(
			faker.string.numeric(10),
		);
		await this.map.verifyCheckbox(KycLevels.LEVEL_1).click();
		await this.map.submitButton(KycLevels.LEVEL_1).click();
	}

	private getDropdownConfig(): Partial<
		Record<
			string,
			{
				container: Locator;
				onRandom: () => Promise<void>;
				onNonRandom: () => Promise<void>;
			}
		>
	> {
		return {
			[KYC_FIELDS.COUNTRY]: {
				container: this.map.countryDropdownContainer(KycLevels.LEVEL_1),
				onRandom: async () => {
					await this.selectRandomOption();
				},
				onNonRandom: async () => {
					await this.map.countryDropdown(KycLevels.LEVEL_1).blur();
				},
			},
			[KYC_LEVEL_2_5_FIELDS.COUNTRY]: {
				container: this.map.countryDropdownContainer(KycLevels.LEVEL_2),
				onRandom: async () => {
					await this.selectRandomOption();
				},
				onNonRandom: async () => {
					await this.page.keyboard.press(KeyboardKey.ESCAPE);
					await this.map
						.countryDropdownContainer(KycLevels.LEVEL_2)
						.blur();
				},
			},
			[KYC_LEVEL_2_5_FIELDS.REASON_FOR_RESIDENCE]: {
				container: this.map.reasonForResidenceDropdown(
					KycLevels.LEVEL_2,
				),
				onRandom: async () => {
					await this.selectRandomOption();
				},
				onNonRandom: async () => {
					await this.page.keyboard.press(KeyboardKey.ESCAPE);
					await this.map
						.reasonForResidenceDropdown(KycLevels.LEVEL_2)
						.blur();
				},
			},
			[KYC_LEVEL_3_FIELDS.PROOF_OF_FUNDS]: {
				container: this.map.proofOfFundsDropdown,
				onRandom: async () => {
					await this.selectRandomOption();
				},
				onNonRandom: async () => {
					await this.page.keyboard.press(KeyboardKey.ESCAPE);
					await this.map.proofOfFundsDropdown.blur();
				},
			},
		};
	}

	@step("Handle file upload validation")
	private async handleFileUploadValidation(value: string): Promise<void> {
		const isFileUploaded = await this.map.uploadedFile.isVisible();
		if (isFileUploaded) {
			await this.map.removeFileButton.click();
		}

		if (!value) {
			await this.handleFileUpload(this.map.uploadProofOfFundsButton, "");
		} else {
			await this.handleFileUpload(
				this.map.uploadProofOfFundsButton,
				value,
			);
		}
	}

	@step("Fill input and trigger validation")
	public async fillInputAndTriggerValidation(
		fieldLabel: string,
		value: string,
	): Promise<void> {
		const dropdownConfig = this.getDropdownConfig();
		const config = dropdownConfig[fieldLabel];

		if (config) {
			const isRandom = value === RANDOM_OPTION;
			await config.container.click();
			await (isRandom ? config.onRandom() : config.onNonRandom());
			return;
		}

		if (fieldLabel === KYC_FIELDS.DATE_OF_BIRTH) {
			await this.selectDateOfBirth(value);
			return;
		}

		if (fieldLabel === KYC_LEVEL_3_FIELDS.FILE_UPLOAD) {
			await this.handleFileUploadValidation(value);
			return;
		}

		const fieldLocator = this.page.getByLabel(fieldLabel);
		await fieldLocator.click();
		if (value) {
			await fieldLocator.fill(value);
		} else {
			await fieldLocator.fill(VALIDATION_TRIGGER_CHAR);
			await fieldLocator.clear();
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

	@step("Upload proof of funds file")
	public async uploadProofOfFundsFile(option: ProofOfFunds): Promise<void> {
		await excludeHeaderFromHost(
			this.page,
			"/s3*.amazonaws.com/",
			"authorization",
		);

		await this.map.proofOfFundsDropdown.click();
		await this.map.proofOfFundsOption(option).click();

		const [fileChooser] = await Promise.all([
			this.page.waitForEvent("filechooser"),
			this.map.uploadProofOfFundsButton.click(),
		]);

		await fileChooser.setFiles(KYC_LEVEL_3_FILE_PATH);
		await this.assertThat().fileIsUploaded();
	}

	@step("Remove uploaded file")
	public async removeUploadedFile(): Promise<void> {
		await this.map.removeFileButton.click();
	}

	@step("Fill in Level 3 verification form")
	public async fillInKycLevel3Form(option: ProofOfFunds): Promise<void> {
		await this.uploadProofOfFundsFile(option);
		await this.map.verifyCheckbox(KycLevels.LEVEL_3).click();
		await this.map.submitButton(KycLevels.LEVEL_3).click();
	}
}
