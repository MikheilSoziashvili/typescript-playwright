import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { SupportPage } from "./support-page";

export class SupportPageSteps extends BasePageStep<SupportPage> {
	public constructor(gamdomPage: SupportPage) {
		super(gamdomPage);
	}

	@step("Navigate to support and verify page is visible")
	public async navigateAndVerifyVisible(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().supportPageIsVisible();
	}
}
