import { BasePageStep } from "core/helpers/base-page-step";
import { logger } from "logger/logger";
import { ProfilePage } from "./profile-page";

export class ProfilePageSteps extends BasePageStep<ProfilePage> {
	public constructor(gamdomPage: ProfilePage) {
		super(gamdomPage);
	}

	private async setHideUserStatisticsMode(): Promise<void> {
		if (!(await this.gamdomPage.map.hideStatisticsToggle.isChecked())) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already enabled");
		}
	}

	private async setShowUserStatisticsMode(): Promise<void> {
		if (await this.gamdomPage.map.hideStatisticsToggle.isChecked()) {
			await this.gamdomPage.map.hideStatisticsToggle.click();
		} else {
			logger.info("Hidden statistics mode already disabled");
		}
	}

	public async toggleUserStatisticsMode(toggle: "on" | "off"): Promise<void> {
		if (toggle === "on") {
			await this.setHideUserStatisticsMode();
		} else {
			await this.setShowUserStatisticsMode();
		}
	}
}
