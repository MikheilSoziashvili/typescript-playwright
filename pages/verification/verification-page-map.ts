import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import {
	KycLevelDisplayName,
	KycLevels,
	ProofOfFunds,
} from "@enums/verification-enums";
import { KYC_LEVEL_3_FIELDS } from "test-data/domains/verification-domain-data";

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

	public get verifyMeTab(): Locator {
		return this.page.getByRole("tab", { name: "Verify me" });
	}

	public get verifyBusinessTab(): Locator {
		return this.page.getByRole("tab", { name: "Verify Business" });
	}

	public get countryDropdownContainer(): Locator {
		return this.page.getByLabel("Country of Residence");
	}

	public get level2countryDropdownContainer(): Locator {
		return this.page.getByRole("combobox", { name: "Country" });
	}

	public get reasonForResidenceDropdown(): Locator {
		return this.page.getByLabel("Reason for Residence");
	}

	public get countryDropdown(): Locator {
		return this.page.locator(
			'input[role="combobox"][aria-autocomplete="list"]',
		);
	}

	public get countryDropdownValuesContainer(): Locator {
		return this.page.getByRole("listbox");
	}

	public get countryDropdownValueItems(): Locator {
		return this.countryDropdownValuesContainer
			.locator("li")
			.getByRole("option");
	}

	public get firstAndLastNameInput(): Locator {
		return this.page.getByLabel("Full name");
	}

	public get dateOfBirthInput(): Locator {
		return this.page.getByLabel("Date of Birth");
	}

	public get businessNameInput(): Locator {
		return this.page.getByLabel("Business name");
	}

	public get bbusinessAddressInput(): Locator {
		return this.page.getByLabel("Business address");
	}

	public get businessRegistrationNumberInput(): Locator {
		return this.page.getByLabel("Registration number");
	}

	public get verifyCheckbox(): Locator {
		return this.page.locator('span[role="button"]', {
			has: this.page.locator(
				'input[type="checkbox"][class*="PrivateSwitchBase-input"]',
			),
		});
	}

	public get submitButton(): Locator {
		return this.page.locator("button", { hasText: "Submit" });
	}

	public getErrorMessageForField(fieldLabel: string): Locator {
		if (fieldLabel === KYC_LEVEL_3_FIELDS.FILE_UPLOAD) {
			return this.fileUploadErrorMessage;
		}
		return this.page
			.getByLabel(fieldLabel)
			.locator("..")
			.locator("..")
			.locator('p[class*="MuiFormHelperText-root"]');
	}

	public getClearButtonForField(fieldLabel: string): Locator {
		return this.page
			.getByLabel(fieldLabel)
			.locator("..")
			.getByTestId("clearInputButton");
	}

	public get level2CountryClearButton(): Locator {
		return this.level2countryDropdownContainer
			.locator("..")
			.getByTestId("CloseIcon");
	}

	public get checkboxValidationMessage(): Locator {
		return this.page.locator('span[class*="MuiTypography-caption"]', {
			hasText: "You must confirm that the information above is accurate.",
		});
	}

	public get kycLevelTwoVerificationTitle(): Locator {
		return this.page.getByText("Level 2 Verification");
	}

	public get levelThreeVerificationHeader(): Locator {
		return this.page.getByText("Level 3 Verification");
	}

	public get proofOfFundsDropdown(): Locator {
		return this.page.getByLabel("Proof of Funds");
	}

	public proofOfFundsOption(option: ProofOfFunds): Locator {
		return this.page.getByRole("option", { name: option });
	}

	public get uploadProofOfFundsButton(): Locator {
		return this.page.getByText("Choose file to upload");
	}

	public get uploadedFile(): Locator {
		return this.page.locator('img[alt="file"]');
	}

	public get fileUploadErrorMessage(): Locator {
		return this.page
			.locator('span[class*="MuiTypography-caption"]')
			.first();
	}

	public get closeIcon(): Locator {
		return this.page.locator("i[class*='icon-close']");
	}

	public get levelThreeVerificationInProgressMessage(): Locator {
		return this.page.getByText(
			"Verification in progress. Please wait for the verification to complete.",
		);
	}
}
