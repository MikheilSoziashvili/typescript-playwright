import { BasePageStep } from "@pages/base/base-page-step";
import { VeriffPortalPage } from "./veriff-portal-page";
import { step } from "decorators/step";
import { veriffConfig } from "configuration";
import {
	InitialVerificationStatus,
	VerificationStatus,
} from "@enums/verification-enums";
import { generate2FACodeFromSecret, waitUntil } from "@core/utils/utils";
import { logger } from "@logger/logger";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class VeriffPortalSteps extends BasePageStep<VeriffPortalPage> {
	public constructor(page: VeriffPortalPage) {
		super(page);
	}

	private get previousCode(): string | undefined {
		return VeriffPortalPage.previousCode;
	}

	private set previousCode(value: string | undefined) {
		VeriffPortalPage.previousCode = value;
	}

	@step("Navigate to Veriff portal and log in")
	public async navigateToVeriffPortalAndLogIn(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().loginPageIsOpened();
		await this.gamdomPage.map.acceptAllCookiesButton.click();
		await this.gamdomPage.map.emailInput.fill(veriffConfig.username);
		await this.gamdomPage.map.passwordInput.fill(veriffConfig.password);
		await this.gamdomPage.map.loginButton.click();

		const code = await this.generateNew2FACode(veriffConfig.secret2FA);
		logger.info(`Generated 2FA code for Veriff portal login: ${code}`);

		await this.gamdomPage.map.multiFactorAuthInput.fill(code);
		await this.gamdomPage.map.loginButton.click();

		this.previousCode = code;
	}

	@step("Generate new 2FA code different from previous")
	private async generateNew2FACode(secret: string): Promise<string> {
		let newCode = await generate2FACodeFromSecret(secret);

		if (this.previousCode) {
			await waitUntil(
				async () => {
					newCode = await generate2FACodeFromSecret(secret);
					const isDifferent = newCode !== this.previousCode;
					if (!isDifferent) {
						logger.info(
							`Code matches previous (${this.previousCode}). Waiting for new code...`,
						);
					}
					return isDifferent;
				},
				{
					errorMessage: `Failed to generate a different 2FA code from ${this.previousCode}`,
					intervalSeconds: TimeoutSeconds.ONE,
					timeoutSeconds: TimeoutSeconds.SIXTY,
				},
			);

			logger.info(
				`Successfully generated new code different from previous: ${newCode}`,
			);
		}

		return newCode;
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
