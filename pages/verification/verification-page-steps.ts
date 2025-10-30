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

	@step("Fill in verification form for KYC level 1")
	public async fillInKycLevel1Form(): Promise<void> {
		await this.gamdomPage.map.firstAndLastNameInput.fill(
			faker.person.fullName(),
		);
		await this.gamdomPage.map.dateOfBirthInput.fill(
			faker.date.birthdate().toISOString().split("T")[0],
		);
		await this.gamdomPage.map.countryDropdownContainer.click();
		await this.gamdomPage.selectRandomCountry();
		await this.gamdomPage.map.verifyCheckbox.click();
		await this.gamdomPage.map.submitButton.click();
	}

	@step("Fill in verification form for KYB level 1")
	public async fillInKybLevel1Form(): Promise<void> {
		await this.gamdomPage.selectVerifyBusinessTab();
		await this.gamdomPage.map.businessNameInput.fill(faker.company.name());
		await this.gamdomPage.map.bbusinessAddressInput.fill(
			faker.location.streetAddress(),
		);
		await this.gamdomPage.map.businessRegistrationNumberInput.fill(
			faker.string.numeric(10),
		);
		await this.gamdomPage.map.verifyCheckbox.click();
		await this.gamdomPage.map.submitButton.click();
	}
}
