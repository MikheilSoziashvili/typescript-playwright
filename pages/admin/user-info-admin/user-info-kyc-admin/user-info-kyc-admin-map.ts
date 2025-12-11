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

	public get rejectionReasonInput(): Locator {
		return this.page.getByLabel("Rejection Reason");
	}

	public get proofOfFundsField(): Locator {
		return this.page.getByLabel("Proof of Funds");
	}

	public get proofOfFundsImage(): Locator {
		return this.page.locator("img[title='Proof of Funds']");
	}

	public get approveDataButton(): Locator {
		return this.page.getByRole("button", { name: "Approve data" });
	}

	public get rejectDataButton(): Locator {
		return this.page.getByRole("button", { name: "Reject data" });
	}
}
