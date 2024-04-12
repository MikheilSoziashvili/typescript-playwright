import { BasePageStep } from "../../../core/helpers/base-page-step";
import { InfoAdminPage } from "./info-admin-page";

export class InfoAdminPageSteps extends BasePageStep<InfoAdminPage> {
	public constructor(gamdomPage: InfoAdminPage) {
		super(gamdomPage);
	}

	public async banUser(options?: { reason?: string }): Promise<void> {
		await this.gamdomPage.map.banUserContainer.waitFor({
			state: "visible",
		});
		if (options?.reason) {
			await this.gamdomPage.map.banUserInput.fill(options.reason);
		}
		await this.gamdomPage.map.banUserButton.click();
		await this.gamdomPage.assertThat().isUserBanned();
		await this.gamdomPage.assertThat().isUnbanButtonDisplayed();
	}
}
