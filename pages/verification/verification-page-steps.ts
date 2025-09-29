import { BasePageStep } from "@pages/base/base-page-step";
import { VerificationPage } from "./verification-page";
import { step } from "decorators/step";
import { faker } from "@faker-js/faker";

export class VerificationPageSteps extends BasePageStep<VerificationPage> {
	public constructor(gamdomPage: VerificationPage) {
		super(gamdomPage);
	}

	@step("Expand country dropdown")
	public async expandCountryDropdown(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.countryDropdown]);
		await this.gamdomPage.openCountryDropdown();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.countryDropdownValuesContainer,
			]);
	}

	@step("Fill in verification form for kyc level 1")
	public async fillInKycLevel1Form(): Promise<void> {
		const formData = this.generateKycLevel1Data();
		await this.fillFormFields(formData);
		await this.gamdomPage.map.countryDropdownContainer.click();
		await this.gamdomPage.selectRandomCountry();
		await this.gamdomPage.map.verifyCheckbox.click();
		await this.gamdomPage.map.submitButton.click();
	}

	private generateKycLevel1Data() {
		return {
			firsAndLasttName: faker.person.fullName(),
			dateOfBirth: faker.date.birthdate().toISOString().split("T")[0],
		};
	}

	@step("Fill in KYC form fields")
	private async fillFormFields(
		formData: Record<string, string>,
	): Promise<void> {
		const fieldMappings = {
			firsAndLasttName: this.gamdomPage.map.firstAndLastNameInput,
			dateOfBirth: this.gamdomPage.map.dateOfBirthInput,
		};

		for (const [fieldName, element] of Object.entries(fieldMappings)) {
			await element.fill(formData[fieldName]);
		}
	}
}
