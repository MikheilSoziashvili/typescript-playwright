import { BasePageStep } from "@pages/base/base-page-step";
import { VerificationPage } from "./verification-page";
import { step } from "decorators/step";
import { VeriffApi } from "@api/veriff-api";
import { KycLevels } from "@enums/verification-enums";

export class VerificationPageSteps extends BasePageStep<VerificationPage> {
	public constructor(gamdomPage: VerificationPage) {
		super(gamdomPage);
	}

	// TODO: To be moved in a corresponding api related class
	@step("Expand country dropdown")
	public async expandCountryDropdown(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.countryDropdown(KycLevels.LEVEL_1),
			]);
		await this.gamdomPage.openCountryDropdown();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.countryDropdownValuesContainer,
			]);
	}

	@step("submit documents for kyc level 2 verification")
	public async submitDocumentsForKycLevel2(
		veriffApi: VeriffApi,
		userId: string,
		documentContent: string,
	): Promise<void> {
		const sessionId = await this.gamdomPage.createSessionInVeriffApi(
			veriffApi,
			userId,
		);
		await this.gamdomPage.uploadDocumentsForVerification(
			veriffApi,
			sessionId,
			documentContent,
		);
		await this.gamdomPage.submitVerificationSession(veriffApi, sessionId);
	}
}
