import { BaseMap } from "@base/base-map";
import { KycAdminActions, KycLevels } from "@enums/verification-enums";
import { Locator, Page } from "@playwright/test";

export class UserInfoKycAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public kycLevelCard(level: KycLevels): Locator {
		return this.page.locator(`#kyc-card-${level}`);
	}

	public kycLevelStatus(level: KycLevels): Locator {
		return this.kycLevelCard(level).locator("[class*=MuiTypography-body2]");
	}

	public kycActionButton(level: KycLevels, button: KycAdminActions): Locator {
		return this.kycLevelCard(level).getByRole("button", {
			name: button,
		});
	}
}
