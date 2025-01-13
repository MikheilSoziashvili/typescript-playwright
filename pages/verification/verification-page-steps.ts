import { BasePageStep } from "@pages/base/base-page-step";
import { VerificationPage } from "./verification-page";
import { step } from "decorators/step";

export class VerificationPageSteps extends BasePageStep<VerificationPage> {
	public constructor(gamdomPage: VerificationPage) {
		super(gamdomPage);
	}

	@step()
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
}
