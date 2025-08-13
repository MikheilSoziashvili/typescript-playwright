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
		await this.gamdomPage.map.countryDropdownInput.click();
		await this.gamdomPage.selectRandomCountry();
		await this.gamdomPage.map.verifyCheckbox.click();
		await this.gamdomPage.map.submitButton.click();
	}

	private generateKycLevel1Data() {
		return {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			dateOfBirth: faker.date.birthdate().toISOString().split("T")[0],
			address: faker.location.streetAddress(),
			city: faker.location.city(),
			postalCode: faker.location.zipCode(),
			stateProvince: faker.location.state(),
		};
	}

	@step("Fill in KYC form fields")
	private async fillFormFields(
		formData: Record<string, string>,
	): Promise<void> {
		await this.gamdomPage.map.titleDropdown.click();
		await this.gamdomPage.map.selectTitleOption.click();

		const fieldMappings = {
			firstName: this.gamdomPage.map.firstNameInput,
			lastName: this.gamdomPage.map.lastNameInput,
			dateOfBirth: this.gamdomPage.map.dateOfBirthInput,
			address: this.gamdomPage.map.addressInput,
			city: this.gamdomPage.map.cityInput,
			postalCode: this.gamdomPage.map.postalCodeInput,
			stateProvince: this.gamdomPage.map.stateProvinceInput,
		};

		for (const [fieldName, element] of Object.entries(fieldMappings)) {
			await element.fill(formData[fieldName]);
		}
	}
}
