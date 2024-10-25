import { BasePage } from "@base/base-page";
import { BasePageNavigationParametersType } from "@core/types/types";
import { generate2FACodeFromSecret, waitForSeconds } from "@core/utils/utils";
import { Page } from "@playwright/test";
import * as Configuration from "configuration";
import { GoogleAuthPageAsserter } from "./google-auth-asserter";
import { GooglePageMap } from "./google-page-map";
import { logger } from "@logger/logger";

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
		await this.enterCredentials(email, password);

		const previousCode = await this.handleTwoStepVerification(authSecret);

		await this.waitForWrongCodeMessageToDisappear();

		logger.info("Waiting for 'Verify it's you' screen...");
		const verifyItsYouScreenVisible = await this.verifyItsYouAppears();

		if (verifyItsYouScreenVisible) {
			await this.handleVerifyItsYou(authSecret, previousCode);
		}
	}

	private async handleTwoStepVerification(
		authSecret: string,
	): Promise<string> {
		const twoFactorAuthenticationCode = await generate2FACodeFromSecret(
			authSecret,
		);
		logger.info(
			`Generation of the first code: ${twoFactorAuthenticationCode}`,
		);

		let previousCode = twoFactorAuthenticationCode;
		await this.map.gTwoFactorCodeField.fill(twoFactorAuthenticationCode);
		await this.map.gTwoFactoryNextBtn.click();

		const isWrongCodeMessageVisible = await this.checkForWrongCodeMessage();

		if (isWrongCodeMessageVisible) {
			let newTwoFactorAuthenticationCode;

			do {
				await waitForSeconds(1);
				newTwoFactorAuthenticationCode =
					await generate2FACodeFromSecret(authSecret);
			} while (newTwoFactorAuthenticationCode === previousCode);

			previousCode = newTwoFactorAuthenticationCode;
			logger.info(
				`Retry with the newly generated code: ${newTwoFactorAuthenticationCode}`,
			);

			await this.map.gTwoFactorCodeField.fill(
				newTwoFactorAuthenticationCode,
			);
			await this.map.gTwoFactoryNextBtn.click();
			await this.page.waitForLoadState("domcontentloaded");

			logger.info("Successfully entered the second code!");
		}
		return previousCode;
	}

	private async checkForWrongCodeMessage(): Promise<boolean> {
		try {
			await this.map.waitForVisibility({
				locator: this.map.wrongCodeMessage,
				timeout: 1000,
			});
			logger.info("Wrong code message appear. Generating a new code...");
			return true;
		} catch (error) {
			logger.info(
				"'Wrong code' message did not appear within the specified timeframe. Moving forward...",
			);
			return false;
		}
	}

	private async waitForWrongCodeMessageToDisappear(): Promise<void> {
		await this.map.waitForInvisibility({
			locator: this.map.wrongCodeMessage,
		});
	}

	private async enterCredentials(
		email: string,
		password: string,
	): Promise<void> {
		await this.map.gEmailField.fill(email);
		await this.map.gMoveForwardBtn.click();
		await this.map.gPasswordField.fill(password);
		await this.map.gPasswordNextBtn.click();
	}

	private async verifyItsYouAppears(): Promise<boolean> {
		try {
			await this.map.waitForVisibility({
				locator: this.map.verifyItsYouScreen,
			});
			logger.info("The 'Verify it's you' screen appeared.");
			return true;
		} catch (error) {
			logger.info(
				"The 'Verify it's you' screen did not appear. Skipping...",
			);
			return false;
		}
	}

	private async handleVerifyItsYou(
		authSecret: string,
		previousCode: string,
	): Promise<void> {
		let twoFactorAuthenticationCode;

		do {
			logger.info(
				"Generating a new code for the 'Verify it's you' screen.",
			);
			await waitForSeconds(1);
			twoFactorAuthenticationCode = await generate2FACodeFromSecret(
				authSecret,
			);
		} while (twoFactorAuthenticationCode === previousCode);

		logger.info(`New code is generated: ${twoFactorAuthenticationCode}`);
		await this.map.gTwoFactorCodeField.fill(twoFactorAuthenticationCode);
		await this.map.gTwoFactoryNextBtn.click();

		logger.info(
			"Successfully entered the code for 'Verify it's you' screen.",
		);
	}
}
