import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { ToastTitle } from "@enums/toast-titles";
import { expect, Locator } from "@playwright/test";
import { step } from "decorators/step";
import { LoginModal } from "./login-modal";

export class LoginModalAsserter extends BaseAsserter<LoginModal> {
	public fromCsv: boolean;
	public constructor(page: LoginModal, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	@step("Check login modal elements are visible")
	async loginModalElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.loginBtn,
				this.gamdomPage.map.usernameField,
				this.gamdomPage.map.passwordField,
			],
			Timeout.MAX,
		);
	}

	@step("Check login button is disabled")
	public async loginBtnIsDisabled(): Promise<void> {
		await expect(this.gamdomPage.map.loginBtn).toBeDisabled();
	}

	@step("Check username field error tooltip")
	public async usernameFieldErrorTooltipIs(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await this.gamdomPage.map.usernameFieldErrorIcon.hover();
		await expect(this.gamdomPage.map.fieldErrorTooltip).toHaveText(text);

		await this.gamdomPage.map.usernameFieldErrorIcon.click(); // click remove icon to remove tooltip
	}

	@step("Check password field error tooltip")
	public async passwordFieldErrorTooltipIs(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await this.gamdomPage.map.passwordFieldErrorIcon.hover();
		await expect(this.gamdomPage.map.fieldErrorTooltip).toHaveText(text);

		await this.gamdomPage.map.passwordFieldErrorIcon.click(); // click remove icon to remove tooltip
	}

	@step("Assert password reset email is sent")
	public async assertPasswordResetEmailIsSent(): Promise<void> {
		await expect(
			this.gamdomPage.map.passwordResetConfirmationText,
		).toBeVisible();
	}

	@step("Check login modal elements are visible - v4")
	async loginModalElementsAreVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.usernameContainerV4,
			this.gamdomPage.map.passwordContainerV4,
			this.gamdomPage.map.loginBtnV4,
		]);
	}

	@step("Check login modal is displayed")
	public async loginModalIsDisplayedV4(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.loginDialogV4]);
	}

	@step("Check login modal is not displayed")
	public async loginModalIsNotDisplayedV4(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.loginDialogV4,
		]);
	}

	@step("Check forgot password form is visible")
	public async forgotPasswordFormIsVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.forgotPasswordFormV4,
		]);
	}

	@step("Check forgot password form is not visible")
	public async forgotPasswordFormIsNotVisibleV4(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.forgotPasswordFormV4,
		]);
	}

	@step("Verify forgot password confirmation text and visibility")
	public async forgotPasswordConfirmationTextAndVisibilityV4(
		expectedText: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.forgotPasswordConfirmationTextV4,
		]);

		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.forgotPasswordConfirmationTextV4,
				expectedText: expectedText,
			},
		]);
	}

	@step("Assert failed login toast message - v4")
	public async assertFailedLoginToastMessageV4(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIsV4(
				ToastTitle.FAILED_V4,
				ToastSubTitle.USER_DOES_NOT_EXIST,
			);
	}

	@step("Check field error text - v4")
	private async checkFieldErrorV4(
		locator: Locator,
		expectedText: string,
	): Promise<void> {
		if (!expectedText) {
			await this.checkElementsAreHidden([locator]);
			return;
		}

		await this.checkElementsHaveText([
			{
				locator,
				expectedText,
			},
		]);
	}

	@step("Check username field error text - v4")
	public async usernameFieldErrorTextIsV4(
		expectedText: string,
	): Promise<void> {
		await this.checkFieldErrorV4(
			this.gamdomPage.map.usernameErrorTooltipV4,
			expectedText,
		);
	}

	@step("Check password field error text - v4")
	public async passwordFieldErrorTextIsV4(
		expectedText: string,
	): Promise<void> {
		await this.checkFieldErrorV4(
			this.gamdomPage.map.passwordErrorTooltipV4,
			expectedText,
		);
	}
}
