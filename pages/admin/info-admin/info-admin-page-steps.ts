import { BasePageStep } from "@pages/base/base-page-step";
import { VisibilityStates } from "@enums/playwright/visibility-states";
import { InfoAdminPage } from "./info-admin-page";

export class InfoAdminPageSteps extends BasePageStep<InfoAdminPage> {
	public constructor(gamdomPage: InfoAdminPage) {
		super(gamdomPage);
	}

	public async banUser(options?: { reason?: string }): Promise<void> {
		await this.gamdomPage.map.waitFor({
			locator: this.gamdomPage.map.banUserContainer,
			state: VisibilityStates.VISIBLE,
		});
		if (options?.reason) {
			await this.gamdomPage.map.banUserInput.fill(options.reason);
		}
		await this.gamdomPage.map.banUserButton.click();
		await this.gamdomPage.assertThat().isUserBanned();
		await this.gamdomPage.assertThat().isUnbanButtonDisplayed();
	}
}
