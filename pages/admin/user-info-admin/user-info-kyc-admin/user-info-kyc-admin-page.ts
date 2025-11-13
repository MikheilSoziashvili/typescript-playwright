import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { UserInfoKycAdminPageAsserter } from "./user-info-kyc-admin-asserter";
import { UserInfoKycAdminPageMap } from "./user-info-kyc-admin-map";
import { step } from "decorators/step";
import { UserInfoKycAdminPageSteps } from "./user-info-kyc-steps";
import { KycAdminActions, KycLevels } from "@enums/verification-enums";

export class UserInfoKycAdminPage extends BasePage<UserInfoKycAdminPageMap> {
	public constructor(page: Page) {
		super(page, new UserInfoKycAdminPageMap(page));
	}

	public override assertThat(): UserInfoKycAdminPageAsserter {
		return new UserInfoKycAdminPageAsserter(this);
	}

	public steps(): UserInfoKycAdminPageSteps {
		return new UserInfoKycAdminPageSteps(this);
	}

	@step("Select action for KYC verification")
	public async selectKycAction(
		level: KycLevels,
		action: KycAdminActions,
	): Promise<void> {
		await this.map.kycActionButton(level, action).click();
	}
}
