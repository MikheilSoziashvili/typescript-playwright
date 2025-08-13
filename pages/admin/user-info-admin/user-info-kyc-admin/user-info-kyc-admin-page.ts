import { BasePage } from "@base/base-page";
import { Page } from "@playwright/test";
import { UserInfoKycAdminPageAsserter } from "./user-info-kyc-admin-asserter";
import { UserInfoKycAdminPageMap } from "./user-info-kyc-admin-map";
import { step } from "decorators/step";
import { UserInfoKycAdminPageSteps } from "./user-info-kyc-steps";

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

	@step("Click view submission button for user")
	public async clickViewSubmissionButton(userName: string): Promise<void> {
		await this.map.viewSubmissionButton(userName).click();
	}

	@step("Approve KYC submission")
	public async clickApproveButton(): Promise<void> {
		await this.map.approveButton.click();
	}
}
