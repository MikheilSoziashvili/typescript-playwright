import { BaseAsserter } from "../../base/base-asserter";
import { expect } from "@playwright/test";
import { LoginModal } from "./login-modal";

export class LoginModalAsserter extends BaseAsserter<LoginModal> {
	public constructor(page: LoginModal) {
		super(page);
	}

	public async loginBtnIsDisabled(): Promise<void> {
		await expect(this.gamdomPage.map.loginBtn).toBeDisabled();
	}

	public async usernameFieldErrorTooltipIs(text: string): Promise<void> {
		await this.gamdomPage.map.usernameFieldErrorIcon.hover();
		await expect(this.gamdomPage.map.fieldErrorTooltip).toHaveText(text);

		await this.gamdomPage.map.usernameFieldErrorIcon.click(); // click remove icon to remove tooltip
	}

	public async passwordFieldErrorTooltipIs(text: string): Promise<void> {
		await this.gamdomPage.map.passwordFieldErrorIcon.hover();
		await expect(this.gamdomPage.map.fieldErrorTooltip).toHaveText(text);

		await this.gamdomPage.map.passwordFieldErrorIcon.click(); // click remove icon to remove tooltip
	}
}
