import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import {
	KycLevelDisplayName,
	KycLevels,
	ProofOfFunds,
} from "@enums/verification-enums";
import { whiteSpacePattern } from "@support/regex-patterns";
import {
	FIELD_ERROR_TESTID_MAP,
	KYC_LEVEL_3_FIELDS,
} from "test-data/domains/verification-domain-data";

export class VerificationPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get verificationPageContainer(): Locator {
		return this.page.getByTestId("kyc-v4-page");
	}

	public levelTitle(level: KycLevels): Locator {
		return this.verificationPageContainer.getByText(
			KycLevelDisplayName[level],
			{
				exact: true,
			},
		);
	}

	public get verificationPageTitle(): Locator {
		return this.verificationPageContainer.getByTestId("kyc-v4-page-title");
	}

	public get veriffIFrameElement(): Locator {
		return this.page.locator("#veriffFrame");
	}

	public kycLevelToggle(level: KycLevels): Locator {
		return this.page.getByTestId(`kyc-${level}-toggle`);
	}

	public levelContent(level: KycLevels): Locator {
		return this.page.getByTestId(
			`kyc-v4-accordion-${level.toLowerCase()}-content`,
		);
	}

	private static readonly LEVEL_FORM_TESTID: Record<KycLevels, string> = {
		[KycLevels.LEVEL_1]: "kyc-v4-level1-form",
		[KycLevels.LEVEL_2]: "kyc-v4-level2",
		[KycLevels.LEVEL_2_5]: "kyc-v4-level25",
		[KycLevels.LEVEL_3]: "kyc-v4-level3",
	};

	public levelForm(level: KycLevels): Locator {
		return this.page.getByTestId(
			VerificationPageMap.LEVEL_FORM_TESTID[level],
		);
	}

	public get verifyMeTab(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-level1-tab-personal",
		);
	}

	public get verifyBusinessTab(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-level1-tab-business",
		);
	}

	public countryDropdownContainer(level: KycLevels): Locator {
		return this.levelForm(level).getByTestId("kyc-v4-country-button");
	}

	public reasonForResidenceDropdown(level: KycLevels): Locator {
		return this.levelForm(level).getByTestId(
			"kyc-v4-residence-reason-button",
		);
	}

	public countryDropdown(level: KycLevels): Locator {
		return this.levelForm(level).getByTestId("kyc-v4-country-button");
	}

	public get countryDropdownValuesContainer(): Locator {
		return this.page.getByRole("listbox");
	}

	public get countryDropdownValueItems(): Locator {
		return this.countryDropdownValuesContainer.getByRole("option");
	}

	public get firstAndLastNameInput(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-full-name-input",
		);
	}

	public get dateOfBirthDayButton(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-date-of-birth-day-button",
		);
	}

	public get dateOfBirthMonthButton(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-date-of-birth-month-button",
		);
	}

	public get dateOfBirthYearButton(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-date-of-birth-year-button",
		);
	}

	public dateOfBirthDayOption(day: number): Locator {
		return this.page.getByTestId(`kyc-v4-date-of-birth-day-option-${day}`);
	}

	public dateOfBirthMonthOption(month: number): Locator {
		return this.page.getByTestId(
			`kyc-v4-date-of-birth-month-option-${month}`,
		);
	}

	public dateOfBirthYearOption(year: number): Locator {
		return this.page.getByTestId(
			`kyc-v4-date-of-birth-year-option-${year}`,
		);
	}

	public get businessNameInput(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-business-name-input",
		);
	}

	public get businessAddressInput(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-business-address-input",
		);
	}

	public get businessRegistrationNumberInput(): Locator {
		return this.levelForm(KycLevels.LEVEL_1).getByTestId(
			"kyc-v4-registration-number-input",
		);
	}

	public verifyCheckbox(level: KycLevels): Locator {
		return this.levelForm(level).getByTestId(
			"kyc-v4-agree-checkbox-container",
		);
	}

	public submitButton(level: KycLevels): Locator {
		return this.levelForm(level).getByTestId("kyc-v4-submit-button");
	}

	public getErrorMessageForField(fieldLabel: string): Locator {
		if (fieldLabel === KYC_LEVEL_3_FIELDS.FILE_UPLOAD) {
			return this.fileUploadErrorMessage;
		}
		const testId = FIELD_ERROR_TESTID_MAP[fieldLabel];
		if (!testId) {
			throw new Error(
				`No error testid mapping for field: "${fieldLabel}"`,
			);
		}
		return this.page.getByTestId(testId);
	}

	public getClearButtonForField(fieldLabel: string): Locator {
		return this.page
			.getByLabel(fieldLabel)
			.locator("..")
			.getByTestId("clearInputButton");
	}

	public get checkboxValidationMessage(): Locator {
		return this.page.getByTestId("kyc-v4-agree-checkbox-error");
	}

	public get kycLevelTwoVerificationTitle(): Locator {
		return this.levelTitle(KycLevels.LEVEL_2);
	}

	public get levelThreeVerificationHeader(): Locator {
		return this.levelTitle(KycLevels.LEVEL_3);
	}

	public get proofOfFundsDropdown(): Locator {
		return this.levelForm(KycLevels.LEVEL_3).getByTestId(
			"kyc-v4-proof-of-funds-button",
		);
	}

	public proofOfFundsOption(option: ProofOfFunds): Locator {
		const key = option.toLowerCase().replace(whiteSpacePattern, "_");
		return this.page.getByTestId(`kyc-v4-proof-of-funds-option-${key}`);
	}

	public get uploadProofOfFundsButton(): Locator {
		return this.levelForm(KycLevels.LEVEL_3).getByTestId("-upload-button");
	}

	public get uploadedFile(): Locator {
		return this.levelForm(KycLevels.LEVEL_3).getByTestId(
			"kyc-v4-uploaded-files-preview",
		);
	}

	public get fileUploadErrorMessage(): Locator {
		return this.page.getByTestId("kyc-v4-upload-error");
	}

	public get removeFileButton(): Locator {
		return this.page.getByTestId("kyc-v4-remove-file-0");
	}

	public get levelThreeVerificationInProgressMessage(): Locator {
		return this.page.getByTestId("kyc-v4-level3-in-progress");
	}
}
