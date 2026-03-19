import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { waitUntil } from "@core/utils/utils";
import { UnauthenticatedHeaderMap } from "@pages/components/header/unauthenticated/unauthenticated-header-map";
import { BannedUserPage } from "./banned-user-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";

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

	@step("Wait for banned user auto-logout after withdrawal")
	public async waitForAutoLogout(): Promise<void> {
		const headerMap = new UnauthenticatedHeaderMap(this.gamdomPage.page);
		await waitUntil(
			async () => {
				await this.gamdomPage.page.reload();
				return headerMap.loginBtn.isVisible();
			},
			{
				errorMessage:
					"User was not auto-logged out after withdrawal confirmed",
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
				intervalSeconds: TimeoutSeconds.FIVE,
			},
		);
	}
}
