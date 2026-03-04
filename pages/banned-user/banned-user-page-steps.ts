import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { BannedUserPage } from "./banned-user-page";

export class BannedUserPageSteps extends BasePageStep<BannedUserPage> {
	public constructor(gamdomPage: BannedUserPage) {
		super(gamdomPage);
	}

	@step("Verify banned page is displayed with reason")
	public async verifyBannedPageWithReason(reason: string): Promise<void> {
		await this.gamdomPage.waitRedContainerToBeVisible();
		await this.gamdomPage.assertThat().isBannedTitleDisplayed();
		await this.gamdomPage.assertThat().isBannedReasonDisplayed(reason);
	}
}
