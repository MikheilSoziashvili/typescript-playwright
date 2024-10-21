import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { generate2FACodeFromSecret } from "@core/utils/utils";
import { Page } from "@playwright/test";
import * as Configuration from "configuration";
import { GoogleAuthPageAsserter } from "./google-auth-asserter";
import { GooglePageMap } from "./google-page-map";

export class GoogleAuthPage extends BasePage<GooglePageMap> {
	public constructor(page: Page) {
		super(page, new GooglePageMap(page));
	}
	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: ["/"] },
		});
	}

	public override assertThat(): GoogleAuthPageAsserter {
		return new GoogleAuthPageAsserter(this);
	}

	public async loginToGoogle(
		email: string = Configuration.google.email,
		password: string = Configuration.google.password,
		authSecret: string = Configuration.google.authSecret,
	): Promise<void> {
		await this.map.gEmailField.fill(email);
		await this.map.gMoveForwardBtn.click();
		await this.map.gPasswordField.fill(password);
		await this.map.gPasswordNextBtn.click();
		const twoFactorAuthenticationCode = await generate2FACodeFromSecret(
			authSecret,
		);
		await this.map.gTwoFactorCodeField.fill(twoFactorAuthenticationCode);
		await this.map.gTwoFactoryNextBtn.click();
		await this.page.waitForLoadState();
		if (await this.map.gTwoFactorCodeField.isVisible()) {
			// TODO: [ENG-2739] Tech debt task for dynamic handling for code
			// Need to wait for 30 seconds for the new 2FA code to be generated
			await this.waitForSeconds(30);
			const twoFactorAuthenticationCodeNew =
				await generate2FACodeFromSecret(authSecret);
			await this.map.gTwoFactorCodeField.fill(
				twoFactorAuthenticationCodeNew,
			);
			await this.map.gTwoFactoryNextBtn.click();
		}
	}
}
