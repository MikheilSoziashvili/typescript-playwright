import { BaseAsserter } from "@base/base-asserter";
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

	@step("Check login button is disabled")
	public async loginBtnIsDisabled(): Promise<void> {
		await this.checkElementsAreDisabled([this.gamdomPage.map.loginBtn]);
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
		await this.checkElementsAreVisible([
			this.gamdomPage.map.forgotPasswordConfirmationText,
		]);
	}

	@step("Check login modal elements are visible")
	async loginModalElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.usernameContainer,
			this.gamdomPage.map.passwordContainer,
			this.gamdomPage.map.loginBtn,
		]);
	}

	@step("Check login modal is displayed")
	public async loginModalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.loginDialog]);
	}

	@step("Check forgot password form is not visible")
	public async forgotPasswordFormIsNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.forgotPasswordForm,
		]);
	}

	@step("Verify forgot password confirmation text and visibility")
	public async forgotPasswordConfirmationTextAndVisibility(
		expectedText: string,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.forgotPasswordConfirmationText,
		]);

		await this.checkElementsHaveText([
			{
				locator: this.gamdomPage.map.forgotPasswordConfirmationText,
				expectedText: expectedText,
			},
		]);
	}

	@step("Assert failed login toast message")
	public async assertFailedLoginToastMessage(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.FAILED,
				ToastSubTitle.INCORRECT_CREDENTIALS,
			);
	}

	@step("Check field error text")
	private async checkFieldError(
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

	@step("Check username field error text")
	public async usernameFieldErrorTextIs(expectedText: string): Promise<void> {
		await this.checkFieldError(
			this.gamdomPage.map.usernameErrorTooltip,
			expectedText,
		);
	}

	@step("Check password field error text")
	public async passwordFieldErrorTextIs(expectedText: string): Promise<void> {
		await this.checkFieldError(
			this.gamdomPage.map.passwordErrorTooltip,
			expectedText,
		);
	}
}
