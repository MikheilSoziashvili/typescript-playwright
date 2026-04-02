import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { AffiliatesInfoPage } from "./affiliates-info-page";

export class AffiliatesInfoPageSteps extends BasePageStep<AffiliatesInfoPage> {
	public constructor(gamdomPage: AffiliatesInfoPage) {
		super(gamdomPage);
	}

	@step("Navigate to affiliates info page and verify it is displayed")
	public async navigateAndVerifyPageIsDisplayed(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().pageIsDisplayed();
	}
}
