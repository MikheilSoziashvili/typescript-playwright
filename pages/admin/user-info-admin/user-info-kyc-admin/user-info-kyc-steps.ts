import { BasePageStep } from "@pages/base/base-page-step";
import { UserInfoKycAdminPage } from "./user-info-kyc-admin-page";
import { step } from "decorators/step";
import { KycLevels, KycAdminActions } from "@enums/verification-enums";
import { REJECTION_REASON_TEXT } from "test-data/domains/verification-domain-data";

export class UserInfoKycAdminPageSteps extends BasePageStep<UserInfoKycAdminPage> {
	public constructor(gamdomPage: UserInfoKycAdminPage) {
		super(gamdomPage);
	}

	@step("Open and approve level 3 submission")
	public async openAndApproveLevel3Submission(): Promise<void> {
		await this.gamdomPage.selectKycAction(
			KycLevels.LEVEL_3,
			KycAdminActions.REVIEW_DATA,
		);
		await this.gamdomPage
			.assertThat()
			.level3SubmittedFormFieldsAndDataAreVisible();
		await this.gamdomPage.map.approveDataButton.click();
	}

	@step("Open and reject level 3 submission")
	public async openAndRejectLevel3Submission(): Promise<void> {
		await this.gamdomPage.selectKycAction(
			KycLevels.LEVEL_3,
			KycAdminActions.REVIEW_DATA,
		);
		await this.gamdomPage
			.assertThat()
			.level3SubmittedFormFieldsAndDataAreVisible();
		await this.gamdomPage.map.rejectionReasonInput.fill(
			REJECTION_REASON_TEXT,
		);
		await this.gamdomPage.map.rejectDataButton.click();
	}
}
