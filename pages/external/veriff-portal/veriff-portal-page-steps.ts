import { BasePageStep } from "@pages/base/base-page-step";
import { VeriffPortalPage } from "./veriff-portal-page";
import { step } from "decorators/step";
import { veriffConfig } from "configuration";
import {
	InitialVerificationStatus,
	VerificationStatus,
} from "@enums/verification-enums";
import { generate2FACodeFromSecret } from "@core/utils/utils";

export class VeriffPortalSteps extends BasePageStep<VeriffPortalPage> {
	public constructor(page: VeriffPortalPage) {
		super(page);
	}

	@step("Navigate to Veriff portal and log in")
	public async navigateToVeriffPortalAndLogIn(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().loginPageIsOpened();
		await this.gamdomPage.map.acceptAllCookiesButton.click();
		await this.gamdomPage.map.emailInput.fill(veriffConfig.username);
		await this.gamdomPage.map.passwordInput.fill(veriffConfig.password);
		await this.gamdomPage.map.loginButton.click();
		const code = await generate2FACodeFromSecret(veriffConfig.secret2FA);
		await this.gamdomPage.map.multiFactorAuthInput.fill(code);
		await this.gamdomPage.map.loginButton.click();
	}

	@step("Open verification details for user")
	public async openVerificationDetails(
		userId: string,
		status: InitialVerificationStatus,
	): Promise<void> {
		await this.gamdomPage.assertThat().verificationPageIsOpened();
		await this.gamdomPage.refresh();
		await this.gamdomPage
			.assertThat()
			.submissionStatusIsDisplayedInTable(userId, status);
		await this.gamdomPage.map.openVerificationLink(userId).click();
	}

	@step("Update verification decision")
	public async updateVerificationDecision(
		userId: string,
		initialStatus: InitialVerificationStatus,
		newStatus: VerificationStatus,
		reason: string,
	): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.userIdIsDisplayedInVerificationDetails(userId);
		await this.gamdomPage
			.assertThat()
			.sessionStatusIsDisplayedInVerificationDetails(initialStatus);

		await this.gamdomPage.refresh();

		await this.gamdomPage.map.updateStatusButton.click();
		await this.gamdomPage.selectDropdownOption(
			this.gamdomPage.map.statusDropdown,
			newStatus,
		);

		if (reason !== "") {
			await this.gamdomPage.selectDropdownOption(
				this.gamdomPage.map.reasonDropdown,
				reason,
			);
		}

		await this.gamdomPage.map.confirmUpdateStatusButton.click();
	}
}
