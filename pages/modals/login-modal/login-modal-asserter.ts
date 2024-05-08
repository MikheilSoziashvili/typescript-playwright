import { BaseAsserter } from "@base/base-asserter";
import { expect } from "@playwright/test";
import { LoginModal } from "./login-modal";

export class LoginModalAsserter extends BaseAsserter<LoginModal> {
	public fromCsv: boolean;
	public constructor(page: LoginModal, fromCsv = false) {
		super(page);
		this.fromCsv = fromCsv;
	}

	public async loginBtnIsDisabled(): Promise<void> {
		await expect(this.gamdomPage.map.loginBtn).toBeDisabled();
	}

	public async usernameFieldErrorTooltipIs(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await this.gamdomPage.map.usernameFieldErrorIcon.hover();
		await expect
			.soft(this.gamdomPage.map.fieldErrorTooltip)
			.toHaveText(text);

		await this.gamdomPage.map.usernameFieldErrorIcon.click(); // click remove icon to remove tooltip
	}

	public async passwordFieldErrorTooltipIs(text: string): Promise<void> {
		if (!text && this.fromCsv) {
			return undefined; // if the value comes from csv and is empty - do nothing
		}
		await this.gamdomPage.map.passwordFieldErrorIcon.hover();
		await expect
			.soft(this.gamdomPage.map.fieldErrorTooltip)
			.toHaveText(text);

		await this.gamdomPage.map.passwordFieldErrorIcon.click(); // click remove icon to remove tooltip
	}
}
