import { BaseAsserter } from "@pages/base/base-asserter";
import { VeriffPortalPage } from "./veriff-portal-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";
import {
	InitialVerificationStatus,
	VerificationStatus,
} from "@enums/verification-enums";
import { Timeout } from "@enums/timeout";

export class VeriffPortalAsserter extends BaseAsserter<VeriffPortalPage> {
	public constructor(page: VeriffPortalPage) {
		super(page);
	}

	@step("Check login page is opened")
	public async loginPageIsOpened(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.emailInput,
			this.gamdomPage.map.passwordInput,
			this.gamdomPage.map.loginButton,
			this.gamdomPage.map.cookieConsentDialog,
		]);
	}

	@step("Check verification page is opened")
	public async verificationPageIsOpened(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.verificationPageTitle,
			this.gamdomPage.map.sessionListTable,
		]);
	}

	@step("Verify submission status is displayed in table")
	public async submissionStatusIsDisplayedInTable(
		userId: string,
		expectedStatus: InitialVerificationStatus,
	): Promise<void> {
		const actualStatus =
			this.gamdomPage.map.verificationStatusInTable(userId);
		await this.checkElementsAreVisible([actualStatus]);
		await this.checkElementsHaveText([
			{
				locator: actualStatus,
				expectedText: expectedStatus,
			},
		]);
	}

	@step("Verify user id in verification details")
	public async userIdIsDisplayedInVerificationDetails(
		expectedUserId: string,
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.vendorData]);
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.vendorData,
				expectedText: expectedUserId,
			},
		]);
	}

	@step("Verify session status in verification details")
	public async sessionStatusIsDisplayedInVerificationDetails(
		expectedStatus: InitialVerificationStatus,
	): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.sessionStatus]);
		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.sessionStatus,
				expectedText: expectedStatus,
			},
		]);
	}

	@step("Verify verification status is updated")
	public async verificationStatusIsUpdated(
		expectedStatus: VerificationStatus,
		reason: string,
	): Promise<void> {
		const actualStatus = this.gamdomPage.map.sessionStatus;
		await this.checkElementsAreVisible([actualStatus]);

		await expect
			.poll(
				async () => {
					await this.gamdomPage.refresh();
					const text = await actualStatus.textContent();
					return text;
				},
				{
					message: `Verification status should update to "${expectedStatus}"`,
					timeout: Timeout.EXTRA_LONG,
					intervals: [Timeout.ULTRA_SHORT],
				},
			)
			.toBe(expectedStatus);

		if (reason !== "") {
			await this.checkElementsHaveText([
				{
					locator: this.gamdomPage.map.selectedReason,
					expectedText: reason,
				},
			]);
		}
	}
}
